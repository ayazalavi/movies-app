// lib/movie-actions.ts
"use server";

import { cookies } from "next/headers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

async function uploadPosterIfAny(file: File | null): Promise<string | undefined> {
    if (!file || file.size === 0) return undefined;

    const bucket = process.env.AWS_S3_BUCKET_NAME!;
    // A simple unique key; customize as you like:
    const key = `posters/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const arrayBuffer = await file.arrayBuffer();

    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: Buffer.from(arrayBuffer),
            ContentType: file.type || "application/octet-stream",
        })
    );

    // Public URL style (adjust to your bucket access/policy):
    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/** Create a new movie */
export async function createMovieAction(fd: FormData) {
    const ownerId = await getCurrentUser();

    if (!ownerId) throw new Error("Login required");

    const title = String(fd.get("title") ?? "").trim();
    const yearRaw = String(fd.get("year") ?? "").trim();
    const poster = fd.get("poster") as File | null;

    if (!title) throw new Error("Title is required");
    const year = Number(yearRaw);
    if (!Number.isInteger(year) || year < 1870 || year > 2100) {
        throw new Error("Publishing year is invalid");
    }

    const posterUrl = await uploadPosterIfAny(poster);

    await prisma.movie.create({
        data: {
            title,
            year,
            posterUrl,
            ownerId: ownerId.sub,
        },
    });
    return { ok: true, redirectTo: "/my-movies" };
}

/** Update an existing movie */
export async function updateMovieAction(fd: FormData) {
    const ownerId = await getCurrentUser();

    if (!ownerId) throw new Error("Login required");

    const id = String(fd.get("id") ?? "");
    if (!id) throw new Error("Missing movie id");

    const title = String(fd.get("title") ?? "").trim();
    const yearRaw = String(fd.get("year") ?? "").trim();
    const poster = fd.get("poster") as File | null;

    if (!title) throw new Error("Title is required");
    const year = Number(yearRaw);
    if (!Number.isInteger(year) || year < 1870 || year > 2100) {
        throw new Error("Publishing year is invalid");
    }

    // Only upload poster if user selected a new file; otherwise keep existing URL
    let posterUrl: string | undefined = undefined;
    if (poster && poster.size > 0) {
        posterUrl = await uploadPosterIfAny(poster);
    }

    // Update only the provided fields
    await prisma.movie.update({
        where: { id, ownerId: ownerId.sub }, // ensure they own the movie
        data: {
            title,
            year,
            ...(posterUrl ? { posterUrl } : {}),
        },
    });

    return { ok: true, redirectTo: "/my-movies" };

}
