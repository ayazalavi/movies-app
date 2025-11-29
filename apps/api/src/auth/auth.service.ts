
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

export interface LoginPayload {
    email: string;
    password: string;
}


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(
        payload: LoginPayload
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(payload.email, payload.password);
        const tokenPayload = { userId: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            access_token: accessToken
        };
    }
}
