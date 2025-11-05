"use client";

import { useState } from "react";
import UploadToS3 from "@/components/UploadtoS3";

export default function NewMoviePage() {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState<number | "">("");
    const [tags, setTags] = useState("");
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function submit() {
        setSubmitting(true);
        // TODO: POST to /api/movies once your backend is ready
        // await fetch('/api/movies', {method:'POST', body: JSON.stringify({title, year:+year, tags: tags.split(",").map(t=>t.trim()), posterUrl })})
        setTimeout(() => { setSubmitting(false); window.location.href = "/movies"; }, 800);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Create a new movie</h1>

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
                    <div>
                        <label className="label">Title</label>
                        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Year</label>
                        <input className="input" type="number" value={year} onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="label">Tags (comma separated)</label>
                        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Action, Drama" />
                    </div>

                    <div className="flex gap-3">
                        <a href="/movies" className="btn bg-slate-800 hover:bg-slate-700">Cancel</a>
                        <button onClick={submit} disabled={submitting} className="btn-primary">
                            {submitting ? "Saving…" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
