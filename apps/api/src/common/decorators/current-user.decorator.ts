import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export interface CurrentUserPayload {
    userId: string;
    email: string;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return {
            userId: user.userId,
            email: user.email,
        };
    },
);
