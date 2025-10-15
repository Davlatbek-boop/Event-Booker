import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Roles } from '../common/decorators/roles-auth.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserSelfGuard } from '../common/guards/user-self.guard';
import { AdminSelfGuard } from '../common/guards/admin-self.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Roles('creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('admin/signup')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'admin successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  signUpAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUpAdmin(createUserDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user and admin' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.signIn(signInDto, res);
  }

  @Get('signout')
  @ApiOperation({ summary: 'Sign out user and admin (clear cookies)' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.usersService.signOut(req, res);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.usersService.refreshToken(req, res);
  }

  @Get('activate/:link')
  @ApiOperation({ summary: 'Activate user account via email link' })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid activation link' })
  activate(@Param('link') link: string) {
    return this.usersService.activate(link);
  }

  @ApiBearerAuth()
  @Roles('admin', 'creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users returned' })
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserSelfGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminSelfGuard)
  @Get('admin/:id')
  @ApiOperation({ summary: 'Get a admin by ID' })
  @ApiResponse({ status: 200, description: 'admin found successfully' })
  @ApiResponse({ status: 404, description: 'admin not found' })
  findOneAdmin(@Param('id') id: string) {
    return this.usersService.findOneAdmin(+id);
  }

  @ApiBearerAuth()
  @Roles('creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('creator/:id')
  @ApiOperation({ summary: 'Get a creator by ID' })
  @ApiResponse({ status: 200, description: 'creator found successfully' })
  @ApiResponse({ status: 404, description: 'creator not found' })
  findOneCreator(@Param('id') id: string) {
    return this.usersService.findOneCreator(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserSelfGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user data' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminSelfGuard)
  @Patch('admin/:id')
  @ApiOperation({ summary: 'Update admin data' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'admin updated successfully' })
  @ApiResponse({ status: 404, description: 'admin not found' })
  updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateAdmin(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserSelfGuard)
  @Patch('update/password/:id')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(+id, updatePasswordDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminSelfGuard)
  @Patch('admin/update/password/:id')
  @ApiOperation({ summary: 'Update admin password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 404, description: 'admin not found' })
  updatePasswordAdmin(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePasswordAdmin(+id, updatePasswordDto);
  }

  @ApiBearerAuth()
  @Roles('admin', 'creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
