import Header from "@/components/Header";
import { LogoutButton } from "@/components/Logout";
import MovieCard from "@/components/MovieCard";
import MoviesPage from "@/components/MoviePage";
import NoMovies from "@/components/NoMovies";
import Pagination from "@/components/Pagination";
import { getTokenFromCookies } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { Movie } from "@moviesapp/shared/schemas/movie.schema";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


type Search = { page?: string; pageSize?: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default async function MyMovies({ searchParams,
}: {
    searchParams: Search;
}) {
    const token = await getTokenFromCookies();
    // middleware should already guard this, but double-check:
    if (!token) {
        return redirect("/");
    }
    const page = Math.max(parseInt((await searchParams).page ?? "1", 10) || 1, 1);

    const res = await fetch(`${API_BASE}/movies?page=${page}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });

    const { movies, totalPages } = await res.json();

    if (!movies.length) {
        return <NoMovies />
    }


    return (
        <div className="md:p-30 px-6 py-20 w-full flex flex-col md:gap-30 gap-20">
            <Header title={"My movies"}
                titleIcon={<Link href={"/my-movies/new"} className="mt-2"><Image src={"/add.svg"} width={32} height={32} alt="" /></Link>}
                rightSlot={<LogoutButton />}
            />

            <div className="grid md:gap-6 gap-x-[20px] gap-y-[40px] md:grid-cols-2 grid-cols-2 lg:grid-cols-4">
                {movies.map((m: Movie) => <MovieCard key={m.id} movie={m} />)}
            </div>

            <MoviesPage page={page} totalPages={totalPages} />

        </div>
    );
}
