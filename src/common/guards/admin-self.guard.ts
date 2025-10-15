import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminSelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request | any = context.switchToHttp().getRequest();

    const person = req.person;

    if (person.role != 'creator') {
      if (person.role == 'user') {
        throw new ForbiddenException({
          message: 'Only admin can access this route',
        });
      }
      if (person.id != req.params.id) {
        throw new ForbiddenException({
          message: 'Your role is not authorized to do this',
        });
      }
    }

    return true;
  }
}
