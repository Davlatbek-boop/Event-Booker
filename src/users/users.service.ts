import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signUpAdmin(createUserDto: CreateUserDto) {
    const admin = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (admin) {
      throw new ConflictException('This email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const newUser = await this.userRepo.save({
      ...createUserDto,
      password: hashedPassword,
      is_active: true,
      role: 'admin',
    });

    return newUser;
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('This email already exists');
    }

    if (createUserDto.role == 'creator' || createUserDto.role == 'admin') {
      throw new ForbiddenException({
        message: 'Your role is not authorized to do this',
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const newUser = await this.userRepo.save({
      ...createUserDto,
      password: hashedPassword,
      activation_link: uuidv4(),
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Email service is unavailable');
    }

    return newUser;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const validPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = await this.generateToken(user);

    res.cookie('refresh-token-user', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_COOKIE_TIME),
    });

    user.refresh_token = tokens.refreshToken;
    await this.userRepo.save(user);

    return {
      message: 'logged successfully',
      token: tokens.accessToken,
    };
  }

  async signOut(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh-token-user'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies.');
    }

    const payload = await this.jwtService.decode(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Refresh token verification failed');
    }

    const user = await this.findByEmail(payload.email);

    if (!user) {
      throw new BadRequestException('No user found with this refresh token.');
    }

    res.clearCookie('refresh-token-user', {
      httpOnly: true,
    });

    user.refresh_token = '';
    await this.userRepo.save(user);

    return {
      message: 'user logged out',
    };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh-token-user'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies.');
    }

    const payload = await this.jwtService.decode(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Refresh token verification failed');
    }

    const user = await this.findByEmail(payload.email);

    if (!user) {
      throw new BadRequestException('No user found with this refresh token.');
    }

    const tokens = await this.generateToken(user);

    res.cookie('refresh-token-user', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_COOKIE_TIME),
    });

    user.refresh_token = tokens.refreshToken;
    await this.userRepo.save(user);

    return {
      message: 'Access token successfully refreshed.',
      token: tokens.accessToken,
    };
  }

  async activate(link: string) {
    const user = await this.userRepo.findOneBy({ activation_link: link });

    if (!user) {
      throw new BadRequestException('Invalid activation link');
    }

    if (user.is_active) {
      throw new BadRequestException('Account is already activated');
    }

    user.is_active = true;
    await this.userRepo.save(user);

    return { message: 'Account successfully activated' };
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, confirmPassword, newPassword } = updatePasswordDto;

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with this id = ${id} was not found`);
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validPassword) {
      throw new BadRequestException('Password is incorrect');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 7);

    user.password = hashedPassword;
    this.userRepo.save(user);
    return {
      message: 'Password updated successfully',
    };
  }

  async updatePasswordAdmin(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, confirmPassword, newPassword } = updatePasswordDto;

    const admin = await this.findOneAdmin(id);

    if (!admin) {
      throw new NotFoundException(`User with this id = ${id} was not found`);
    }

    const validPassword = await bcrypt.compare(oldPassword, admin.password);

    if (!validPassword) {
      throw new BadRequestException('Password is incorrect');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 7);

    admin.password = hashedPassword;
    this.userRepo.save(admin);
    return {
      message: 'Password updated successfully',
    };
  }

  findAll() {
    return this.userRepo.find({
      relations: ['bookings'],
      where: { role: 'user' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id, role: 'user' } });

    if (!user) {
      throw new NotFoundException('User not found or not authorized');
    }

    return user;
  }

  async findOneAdmin(id: number) {
    const user = await this.userRepo.findOne({ where: { id, role: 'admin' } });

    if (!user) {
      throw new NotFoundException('Admin not found or not authorized');
    }

    return user;
  }

  async findOneCreator(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Creator not found or not authorized');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id, role: 'admin' } });

    if (user) {
      throw new ForbiddenException('Admins cannot update other admins');
    }

    if (updateUserDto.password) {
      throw new BadRequestException(
        'Use the password update route to change password',
      );
    }

    const updatedUser = await this.userRepo.preload({
      id,
      ...updateUserDto,
      role: 'user',
    });

    if (!updatedUser) {
      throw new NotFoundException('User with this ID was not found');
    }

    return this.userRepo.save(updatedUser);
  }

  async updateAdmin(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepo.preload({ id, ...updateUserDto });

    if (!updatedUser) {
      throw new NotFoundException('admin with this ID was not found');
    }

    return this.userRepo.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('User with this ID was not found');
    }
    this.userRepo.delete(id);
    return {
      message: `User with this ID=${id} deleted`,
    };
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async generateToken(user: User) {
    const payload = {
      id: Number(user.id),
      userName: String(user.user_name),
      email: String(user.email),
      role: String(user.role),
      is_active: Boolean(user.is_active),
    } as any;

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY as string,
      expiresIn: process.env.ACCESS_TOKEN_TIME as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY as string,
      expiresIn: process.env.REFRESH_TOKEN_TIME as any,
    });

    return { accessToken, refreshToken };
  }
}
