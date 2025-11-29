// apps/api/src/movies/movies.service.ts
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
    CreateMovieInput,
    UpdateMovieInput,
} from '@moviesapp/shared/schemas/movie.schema';
import {
    S3Client,
    PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class MoviesService {
    private readonly s3 = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    private readonly bucket = process.env.AWS_S3_BUCKET_NAME!;

    constructor(private readonly prisma: PrismaService) { }

    async findAllForUser(ownerId: string, pageNumber?: string) {
        const total = await this.prisma.movie.count({ where: { ownerId } });
        const pageSize = 10;
        const totalPages = Math.max(Math.ceil(total / pageSize), 1);

        const page =
            Math.max(
                Math.min(parseInt(pageNumber ?? '1', 10) || 1, totalPages),
                1,
            );

        const movies = await this.prisma.movie.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: { id: true, title: true, year: true, posterUrl: true },
        });

        return { movies, totalPages, page };
    }

    /** Upload poster to S3 if present; return public URL or undefined */
    async uploadPosterIfAny(
        file?: Express.Multer.File | null,
    ): Promise<string | undefined> {
        if (!file || !file.buffer || file.size === 0) return undefined;

        const key = `posters/${Date.now()}-${file.originalname.replace(
            /\s+/g,
            '-',
        )}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype || 'application/octet-stream',
            }),
        );

        return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    async createForUser(ownerId: string, dto: CreateMovieInput) {
        return this.prisma.movie.create({
            data: {
                title: dto.title,
                year: parseInt(dto.year, 10),
                posterUrl: dto.posterUrl ?? null,
                ownerId,
            },
        });
    }

    private async ensureOwned(ownerId: string, id: string) {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie) throw new NotFoundException('Movie not found');
        if (movie.ownerId !== ownerId) throw new ForbiddenException();
        return movie;
    }

    async updateForUser(ownerId: string, dto: UpdateMovieInput) {
        await this.ensureOwned(ownerId, dto.id);

        return this.prisma.movie.update({
            where: { id: dto.id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title } : {}),
                ...(dto.year !== undefined
                    ? { year: parseInt(dto.year, 10) }
                    : {}),
                ...(dto.posterUrl !== undefined
                    ? { posterUrl: dto.posterUrl }
                    : {}),
            },
        });
    }

    async removeForUser(ownerId: string, id: string) {
        await this.ensureOwned(ownerId, id);
        await this.prisma.movie.delete({ where: { id } });
        return { success: true };
    }
}
