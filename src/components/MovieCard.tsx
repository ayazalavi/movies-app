import Image from "next/image";

export default function MovieCard({ m }: { m: any }) {
    return (
        <div className="rounded-xl bg-slate-800/70 p-3 hover:-translate-y-0.5 transition">
            {m.posterUrl ? (
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={m.title} src={m.posterUrl} className="h-full w-full object-cover" />
                </div>
            ) : <div className="h-48 rounded-lg bg-slate-700" />}
            <div className="mt-3">
                <div className="font-semibold text-white">{m.title}</div>
                <div className="text-slate-400 text-sm">{m.year}</div>
            </div>
        </div>
    );
}
