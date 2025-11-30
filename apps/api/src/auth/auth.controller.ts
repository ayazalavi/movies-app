
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response,
    ) {

        const { email, password, remember } = signInDto;

        const response = await this.authService.signIn({ email, password });
        res.cookie('token', response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 days or session
        });

        return { ok: true, access_token: response.access_token };
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('logout')
    async logout(@Res({ passthrough: true }) res: Response,
    ) {
        res.clearCookie('token');
        return { ok: true };
    }

}
