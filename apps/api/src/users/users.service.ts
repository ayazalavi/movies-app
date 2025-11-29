
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';

export type User = any;

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findOne(email: string, password: string): Promise<User | undefined> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;

    }
}
