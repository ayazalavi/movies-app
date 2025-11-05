"use client";

import { useEffect, useState } from "react";
import UploadToS3 from "@/components/UploadtoS3";

export default function EditMoviePage({ params }: { params: { id: string } }) {
    const id = params.id;
    const [title, setTitle] = useState("");
    const [year, setYear] = useState<number | "">("");
    const [tags, setTags] = useState("");
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with GET /api/movies/:id
        (async () => {
            setLoading(true);
            const m = { id, title: "Movie 1", year: 2024, tags: ["Action"], posterUrl: "/placeholder.svg" };
            setTitle(m.title); setYear(m.year); setTags(m.tags.join(", ")); setPosterUrl(m.posterUrl || null);
            setLoading(false);
        })();
    }, [id]);

    async function update() {
        // PUT /api/movies/:id with {title, year, tags, posterUrl}
        // await fetch(`/api/movies/${id}`, { method: "PUT", body: JSON.stringify({...}) });
        window.location.href = "/movies";
    }

    if (loading) return <p>Loading…</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Edit</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="card">
                    <label className="label">Poster image</label>
                    <UploadToS3 onUploaded={setPosterUrl} />
                    {posterUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={posterUrl} alt="poster" className="mt-3 h-64 w-full rounded-xl object-cover ring-1 ring-white/10" />
                    )}
                </div>

                <div className="card space-y-4">
                    <div><label className="label">Title</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                    <div><label className="label">Year</label><input className="input" type="number" value={year} onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))} /></div>
                    <div><label className="label">Tags</label><input className="input" value={tags} onChange={(e) => setTags(e.target.value)} /></div>

                    <div className="flex gap-3">
                        <a href="/movies" className="btn bg-slate-800 hover:bg-slate-700">Cancel</a>
                        <button onClick={update} className="btn-primary">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
