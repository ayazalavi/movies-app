import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
    @ApiProperty({
        example: "Inception",
        description: "Movie title",
    })
    title: string = "";

    @ApiProperty({
        example: 2010,
        description: "Release year",
    })
    year: number = 2010;

    @ApiProperty({
        format: "binary"
    })
    poster: string = "";
}
