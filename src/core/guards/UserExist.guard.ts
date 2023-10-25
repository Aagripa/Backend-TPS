import { CanActivate, ExecutionContext, Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const { nip, email } = request.body;

        // Cari pengguna berdasarkan NIP
        const userByNip = await this.userService.findOneById(nip);

        if (userByNip) {
            throw new HttpException('This NIP already exists', HttpStatus.OK);
        }

        // Cari pengguna berdasarkan email
        const userByEmail = await this.userService.findOneByEmail(email);

        if (userByEmail) {
            throw new HttpException('This email already exists', HttpStatus.OK);
        }

        return true;
    }
}