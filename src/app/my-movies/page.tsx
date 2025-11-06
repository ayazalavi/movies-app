import Header from "@/components/Header";
import { LogoutButton } from "@/components/Logout";
import MovieCard from "@/components/MovieCard";
import MoviesPage from "@/components/MoviePage";
import NoMovies from "@/components/NoMovies";
import Pagination from "@/components/Pagination";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


type Search = { page?: string; pageSize?: string };

export default async function MyMovies({ searchParams,
}: {
    searchParams: Search;
}) {
    const ownerId = await getCurrentUser();
    // middleware should already guard this, but double-check:
    if (!ownerId) {
        return redirect("/");
    }

    const total = await prisma.movie.count({ where: { ownerId: ownerId.sub } });
    const pageSize = Math.min(
        Math.max(parseInt((await searchParams).pageSize ?? "8", 10) || 12, 1),
        60
    );
    const totalPages = Math.ceil(total / pageSize);

    const page = Math.max(Math.min(parseInt((await searchParams).page ?? "1", 10) || 1, totalPages), 1);

    const movies = await prisma.movie.findMany({
        where: { ownerId: ownerId.sub },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, title: true, year: true, posterUrl: true },
    });



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
                {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>

            <MoviesPage page={page} totalPages={totalPages} />

        </div>
    );
}
