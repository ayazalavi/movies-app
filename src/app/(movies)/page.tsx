import MovieCard from "@/components/MovieCard";
import Link from "next/link";

async function getMovies() {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/movies` : "http://localhost:3000/api/movies", { cache: "no-store" });
    return res.json();
}

export default async function MoviesPage() {
    const movies = await getMovies();

    if (!movies.length) {
        return (
            <section className="mx-auto max-w-5xl py-16 text-center">
                <h2 className="text-2xl text-white">Your movie list is empty</h2>
                <Link className="btn-primary mt-6 inline-block" href="/new">Add a new movie</Link>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-6xl py-10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl text-white">My movies</h1>
                <Link className="btn-primary" href="/new">Add a new movie</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {movies.map((m: any) => <MovieCard key={m.id} m={m} />)}
            </div>
        </section>
    );
}
