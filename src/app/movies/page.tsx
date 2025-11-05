import MovieCard from "@/components/MovieCard";

async function getMovies() {
    // Replace with real fetch to your /api/movies
    return [
        { id: "1", title: "Movie 1", year: 2024, posterUrl: "/placeholder.svg", tags: ["Action"] },
        { id: "2", title: "Movie 2", year: 2023, posterUrl: "/placeholder.svg", tags: ["Drama"] },
    ];
}

export default async function MoviesPage() {
    const movies = await getMovies();

    if (!movies.length) {
        return (
            <div className="grid min-h-[60dvh] place-items-center">
                <div className="card text-center">
                    <p className="mb-4 text-lg text-slate-300">Your movie list is empty</p>
                    <a href="/movies/new" className="btn-primary inline-block">Add a new movie</a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">My movies</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
        </div>
    );
}
