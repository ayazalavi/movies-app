// components/MovieForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import clsx from "clsx";

type Movie = {
    id?: string;
    title: string;
    year?: number;
    posterUrl?: string | null; // preview url for initial
};

type Props = {
    mode: "create" | "edit";
    initialData?: Movie;
    onSubmit: (payload: FormData) => Promise<any>; // server action passed from page
};

const MovieSchema = z.object({
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
});

export default function MovieForm({
    mode,
    initialData,
    onSubmit,
}: Props) {
    const router = useRouter();

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [year, setYear] = useState(initialData?.year?.toString() ?? "");
    const [posterPreview, setPosterPreview] = useState<string | undefined>(
        initialData?.posterUrl ?? undefined
    );
    const [posterFile, setPosterFile] = useState<File | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState<{
        title?: string;
        year?: string;
        poster?: string;
        form?: string;
    }>({});

    useEffect(() => {
        return () => {
            if (posterPreview?.startsWith("blob:")) URL.revokeObjectURL(posterPreview);
        };
    }, [posterPreview]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] || null;
        setPosterFile(f);
        if (!f) {
            setPosterPreview(initialData?.posterUrl ?? undefined);
            return;
        }
        const url = URL.createObjectURL(f);
        setPosterPreview(url);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});

        // 1) Zod validate text fields
        const parsed = MovieSchema.safeParse({ title: title.trim(), year: year.trim() });

        const nextErrors: typeof errors = {};
        if (!parsed.success) {
            for (const issue of parsed.error.issues) {
                if (issue.path[0] === "title") nextErrors.title = issue.message;
                if (issue.path[0] === "year") nextErrors.year = issue.message;
            }
        }

        // 2) Poster required: either a new file OR an existing posterUrl in edit mode
        const hasExistingPoster = Boolean(initialData?.posterUrl);
        if (!posterFile && !hasExistingPoster) {
            nextErrors.poster = "Poster image is required";
        }

        if (nextErrors.title || nextErrors.year || nextErrors.poster) {
            setErrors(nextErrors);
            return;
        }

        // 3) Build FormData and submit
        const fd = new FormData();
        fd.set("title", title.trim());
        fd.set("year", year.trim());
        if (posterFile) fd.set("poster", posterFile);
        if (initialData?.id) fd.set("id", initialData.id);

        try {
            setSubmitting(true);
            const res = await onSubmit(fd); // server action will redirect on success
            if (res?.ok && res.redirectTo) router.replace(res.redirectTo);

        } catch (err: any) {
            setErrors((prev) => ({ ...prev, form: err?.message || "Unable to save movie" }));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:gap-[127px] gap-6 md:grid-cols-[minmax(240px,320px)_1fr]"
            noValidate
        >
            {/* Poster */}
            <div className="md:order-1 order-2">
                <div
                    className={clsx(
                        "relative flex md:aspect-[4/5] aspect-[5/5] border border-dotted border-[2px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[var(--color-input)] ring-1 ring-white/10 hover:ring-white/20",
                        errors.poster ? "ring-2 ring-error" : "ring-white/10"
                    )}
                    onClick={() => fileRef.current?.click()}
                    aria-invalid={!!errors.poster}
                    aria-describedby={errors.poster ? "poster-error" : undefined}
                >
                    {posterPreview ? (
                        <Image
                            src={posterPreview}
                            alt="Poster preview"
                            fill
                            className="rounded-[10px] object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center text-white">
                            <Image src={"/download.svg"} width={24} height={24} alt="Download" />
                            <span className="text-sm">Drop an image here</span>
                        </div>
                    )}
                    <input
                        ref={fileRef}
                        name="poster"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                {errors.poster && (
                    <p id="poster-error" className="mt-2 text-sm text-error">
                        {errors.poster}
                    </p>
                )}
            </div>

            {/* Fields */}
            <div className="grid content-start md:gap-6 gap-6 md:w-[362px] md:order-2 order-1">
                <div>
                    <input
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className={clsx("input", errors.title && "ring-2 ring-error")}
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? "title-error" : undefined}
                    />
                    {errors.title && (
                        <p id="title-error" className="mt-2 text-sm text-error">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        name="year"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Publishing year"
                        className={clsx("input md:w-[216px] w-full", errors.year && "ring-2 ring-error")}
                        aria-invalid={!!errors.year}
                        aria-describedby={errors.year ? "year-error" : undefined}
                    />
                    {errors.year && (
                        <p id="year-error" className="mt-2 text-sm text-error">
                            {errors.year}
                        </p>
                    )}
                </div>

                {/* Form-level error */}
                {errors.form && (
                    <p className="mt-2 text-sm text-error" role="alert">
                        {errors.form}
                    </p>
                )}

                {/* Actions (equal width) */}
                <div className="mt-10 grid grid-cols-2 gap-3 hidden md:grid">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            redirect("/")
                        }}
                        className="btn-cancel w-full text-center"
                    >
                        Cancel
                    </button>

                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                        {submitting ? (mode === "edit" ? "Updating..." : "Submitting...") : mode === "edit" ? "Update" : "Submit"}
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 order-3 gap-4 block md:hidden">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        redirect("/")
                    }}
                    className="btn-cancel w-full text-center"
                >
                    Cancel
                </button>

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? (mode === "edit" ? "Updating..." : "Submitting...") : mode === "edit" ? "Update" : "Submit"}
                </button>
            </div>
        </form>
    )
}
