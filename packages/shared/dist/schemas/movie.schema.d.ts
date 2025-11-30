import { z } from "zod";
export type Movie = {
    id?: string;
    title: string;
    year?: number;
    posterUrl?: string | null;
};
export type MovieFormProps = {
    mode: "create" | "edit";
    initialData?: Movie;
};
export declare const MovieBaseSchema: z.ZodObject<{
    title: z.ZodString;
    year: z.ZodString;
    posterUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const CreateMovieSchema: z.ZodObject<{
    title: z.ZodString;
    year: z.ZodString;
    posterUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const UpdateMovieBodySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodString>;
    posterUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare const UpdateMovieSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodString>;
    posterUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    id: z.ZodString;
}, z.core.$strip>;
export type CreateMovieInput = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieBodyInput = z.infer<typeof UpdateMovieBodySchema>;
export type UpdateMovieInput = z.infer<typeof UpdateMovieSchema>;
