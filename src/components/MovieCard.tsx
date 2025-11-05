import Link from "next/link";

export default function MovieCard({ movie }: { movie: { id: string; title: string; year: number; posterUrl?: string | null; tags?: string[] } }) {
    return (
        <div className="card overflow-hidden p-0">
            <div className="aspect-[3/4] w-full bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{movie.title}</h3>
                    <span className="text-sm text-slate-400">{movie.year}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {movie.tags?.map((t) => (
                        <span key={t} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{t}</span>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Link href={`/movies/${movie.id}/edit`} className="btn bg-slate-800 hover:bg-slate-700">Edit</Link>
                </div>
            </div>
        </div>
    );
}
