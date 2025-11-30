import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MoviesService } from './movies.service';
import {
    CreateMovieSchema,
    MovieBaseSchema,
    UpdateMovieBodySchema,
    UpdateMovieSchema,
    type CreateMovieInput,
    type UpdateMovieInput,
} from '@moviesapp/shared/schemas/movie.schema';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateMovieDto } from '@/common/dtos/movie.swagger.dto';

@ApiBearerAuth('access_token')
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    @Get()
    getMyMovies(
        @CurrentUser() user: { userId: string },
        @Query('page') page?: string,
    ) {
        return this.moviesService.findAllForUser(user.userId, page);
    }

    @Get(":id")
    getMovieById(
        @CurrentUser() user: { userId: string },
        @Param('id') id: string,
    ) {
        return this.moviesService.ensureOwned(user.userId, id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('poster'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Create a new movie',
        type: CreateMovieDto,
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                year: { type: 'number' },
                poster: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['title', 'year', 'poster'],
        },
    })
    async createMovie(
        @CurrentUser() user: { userId: string },
        @UploadedFile() poster: Express.Multer.File,
        @Body() body: any,
    ) {
        const parsed = MovieBaseSchema.safeParse({
            title: body.title,
            year: body.year,
        });

        if (!parsed.success) {
            const issue = parsed.error.issues[0];
            throw new BadRequestException(issue?.message ?? 'Invalid input');
        }

        if (!poster || !poster.buffer || poster.size === 0) {
            throw new BadRequestException('Poster image is required');
        }

        const posterUrl = await this.moviesService.uploadPosterIfAny(poster);

        const dto: CreateMovieInput = CreateMovieSchema.parse({
            ...parsed.data,
            posterUrl,
        });

        return this.moviesService.createForUser(user.userId, dto);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('poster'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Update a movie',
        type: CreateMovieDto,
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                year: { type: 'number' },
                poster: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['title', 'year', "poster"],
        },
    })
    async updateMovie(
        @CurrentUser() user: { userId: string },
        @Param('id') id: string,
        @UploadedFile() poster: Express.Multer.File,
        @Body() body: any,
    ) {
        // Partial validation for title/year
        const parsedBody = UpdateMovieBodySchema.safeParse({
            title: body.title,
            year: body.year,
        });

        if (!parsedBody.success) {
            const issue = parsedBody.error.issues[0];
            throw new BadRequestException(issue?.message ?? 'Invalid input');
        }

        // Only upload new poster if provided
        let posterUrl: string | undefined;
        if (poster && poster.buffer && poster.size > 0) {
            posterUrl = await this.moviesService.uploadPosterIfAny(poster);
        }

        const dto: UpdateMovieInput = UpdateMovieSchema.parse({
            id,
            ...parsedBody.data,
            ...(posterUrl ? { posterUrl } : {}),
        });

        return this.moviesService.updateForUser(user.userId, dto);
    }

    @Delete(':id')
    deleteMovie(
        @CurrentUser() user: { userId: string },
        @Param('id') id: string,
    ) {
        return this.moviesService.removeForUser(user.userId, id);
    }
}
