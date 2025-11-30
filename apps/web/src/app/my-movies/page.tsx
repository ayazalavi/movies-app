"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header";
import { LogoutButton } from "@/components/Logout";
import MovieCard from "@/components/MovieCard";
import MoviesPage from "@/components/MoviePage";
import NoMovies from "@/components/NoMovies";
import { Movie } from "@moviesapp/shared/schemas/movie.schema";

type Search = { page?: string; pageSize?: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type MoviesResponse = {
    movies: Movie[];
    totalPages: number;
    page?: number;
};

export default function MyMovies({
    searchParams,
}: {
    searchParams: Search;
}) {
    const router = useRouter();

    const [page, setPage] = useState<number>();

    async function setInitialPage() {
        const initialPage = Math.max(
            parseInt((await searchParams)?.page ?? "1", 10) || 1,
            1,
        );
        setPage(initialPage)
    }

    useEffect(() => {
        setInitialPage()
    }, [searchParams])



    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMovies() {

            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/logout`, {
            //     method: "GET",
            //     credentials: "include",
            //     headers: { "Content-Type": "application/json" },
            // });
            setLoading(true);
            setError(null);

            try {
                const token =
                    typeof window !== "undefined"
                        ? localStorage.getItem("token")
                        : null;

                if (!token) {
                    router.replace("/");
                    return;
                }

                const res = await fetch(`${API_BASE}/movies?page=${page}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        credentials: "include",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401) {
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("token");
                    }
                    router.replace("/");
                    return;
                }

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || "Failed to load movies");
                }

                const data: MoviesResponse = await res.json();
                setMovies(data.movies || []);
                setTotalPages(data.totalPages || 1);
            } catch (err: any) {
                setError(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, [page, router]);

    if (loading) {
        return (
            <div className="md:p-30 px-6 py-20 w-full flex flex-col gap-6">
                <p className="text-white/80">Loading your movies…</p>
            </div>
        );
    }

    if (!movies.length) {
        return (
            <div className="md:p-30 px-6 py-20 w-full flex flex-col gap-6">
                <NoMovies />
            </div>
        );
    }

    return (
        <div className="md:p-30 px-6 py-20 w-full flex flex-col md:gap-30 gap-20">
            <Header
                title="My movies"
                titleIcon={
                    <Link href="/my-movies/new" className="mt-2">
                        <Image src="/add.svg" width={32} height={32} alt="" />
                    </Link>
                }
                rightSlot={<LogoutButton />}
            />

            <div className="grid md:gap-6 gap-x-[20px] gap-y-[40px] md:grid-cols-2 grid-cols-2 lg:grid-cols-4">
                {movies.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                ))}
            </div>

            <MoviesPage page={page || 1} totalPages={totalPages} />
        </div>
    );
}
