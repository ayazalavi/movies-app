"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMovieSchema = exports.UpdateMovieBodySchema = exports.CreateMovieSchema = exports.MovieBaseSchema = void 0;
const zod_1 = require("zod");
exports.MovieBaseSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(200, "Title is too long"),
    year: zod_1.z
        .string()
        .min(1, "Publishing year is required")
        .regex(/^\d{4}$/, "Enter a 4-digit year")
        .refine((v) => {
        const n = Number(v);
        return n >= 1870 && n <= 2100;
    }, "Enter a valid year (1870–2100)"),
    posterUrl: zod_1.z.string().url().optional().nullable(),
});
exports.CreateMovieSchema = exports.MovieBaseSchema;
exports.UpdateMovieBodySchema = exports.MovieBaseSchema.partial();
exports.UpdateMovieSchema = exports.MovieBaseSchema.partial().extend({
    id: zod_1.z.string(), // or z.string().cuid() if you want
});
