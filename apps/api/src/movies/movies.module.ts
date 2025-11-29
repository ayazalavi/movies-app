import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from 'src/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [MoviesService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, PrismaService],
  controllers: [MoviesController],
  exports: [MoviesService],
  imports: [
    MulterModule.register({}),
  ],

})
export class MoviesModule { }
