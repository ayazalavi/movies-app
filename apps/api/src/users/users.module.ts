
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UsersService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
    PrismaService
  ],
  exports: [UsersService],
})
export class UsersModule { }
