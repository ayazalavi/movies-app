"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MovieForm from "@/components/MovieForm";
import { Movie } from "@moviesapp/shared/schemas/movie.schema";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function EditMoviePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadMovie() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    router.replace("/");
                    return;
                }

                const res = await fetch(`${API_BASE}/movies/${(await params).id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401) {
                    localStorage.removeItem("token");
                    router.replace("/");
                    return;
                }

                if (!res.ok) {
                    setError("Movie not found");
                    return;
                }

                const data = await res.json();
                setMovie(data);
            } catch (err) {
                setError("Failed to fetch movie");
            } finally {
                setLoading(false);
            }
        }

        loadMovie();
    }, [params, router]);

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-5xl px-4 py-16 text-center text-white/70">
                Loading movie...
            </main>
        );
    }

    if (error || !movie) {
        return (
            <main className="mx-auto w-full max-w-5xl px-4 py-16 text-center text-white/70">
                {error || "Movie not found."}
            </main>
        );
    }

    return (
        <main className="mx-auto w-full md:px-[120px] px-6 py-20 md:pt-[120px] md:pb-[89px] grid md:gap-[120px] gap-20">
            <Header title="Edit" />
            <MovieForm mode="edit" initialData={movie} />
        </main>
    );
}
