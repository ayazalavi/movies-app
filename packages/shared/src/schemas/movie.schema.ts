import { z } from "zod";


export type Movie = {
    id?: string;
    title: string;
    year?: number;
    posterUrl?: string | null; // preview url for initial
};

export type MovieFormProps = {
    mode: "create" | "edit";
    initialData?: Movie;
};

export const MovieBaseSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title is too long"),
    year: z
        .string()
        .min(1, "Publishing year is required")
        .regex(/^\d{4}$/, "Enter a 4-digit year")
        .refine((v) => {
            const n = Number(v);
            return n >= 1870 && n <= 2100;
        }, "Enter a valid year (1870–2100)"),
    posterUrl: z.string().url().optional().nullable(),
});


export const CreateMovieSchema = MovieBaseSchema;

export const UpdateMovieBodySchema = MovieBaseSchema.partial();

export const UpdateMovieSchema = MovieBaseSchema.partial().extend({
    id: z.string(), // or z.string().cuid() if you want
});

// Types you can import everywhere
export type CreateMovieInput = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieBodyInput = z.infer<typeof UpdateMovieBodySchema>;
export type UpdateMovieInput = z.infer<typeof UpdateMovieSchema>;
