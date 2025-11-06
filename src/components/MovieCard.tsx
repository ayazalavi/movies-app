import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: { id: string; title: string; year: number; posterUrl?: string | null; } }) {
    return (
        <Link href={`/my-movies/${movie.id}`}><div className="card overflow-hidden grid md:gap-4 gap-3 justify-items-start">
            <div className="md:min-h-[400px] min-h-[334px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image width={266} height={400} src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} className="h-full w-full object-cover md:rounded-xl rounded-t-xl rounded-b-none" />
            </div>
            <div className="flex flex-col items-start justify-between md:gap-2 gap-4 md:p-2 px-3 pb-3">
                <h3 className="md:text-xl text-base font-bold md:font-medium">{movie.title}</h3>
                <span className="text-sm text-white">{movie.year}</span>
            </div>
        </div></Link>
    );
}
