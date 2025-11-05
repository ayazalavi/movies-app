"use client";
import { useState } from "react";

export default function MovieForm({ initial, onDone }: {
    initial?: { title?: string; year?: number; posterUrl?: string; tags?: string[] };
    onDone?: () => void;
}) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
    const [posterUrl, setPosterUrl] = useState(initial?.posterUrl ?? "");
    const [tags, setTags] = useState((initial?.tags ?? []).join(","));

    async function submit() {
        const payload = { title, year, posterUrl, tags: tags.split(",").map(t => t.trim()).filter(Boolean) };
        const res = await fetch("/api/movies", { method: "POST", body: JSON.stringify(payload) });
        if (res.ok) onDone?.();
    }

    return (
        <div className="space-y-3">
            <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="input" placeholder="Year" value={year} onChange={e => setYear(+e.target.value)} />
            <input className="input" placeholder="Poster URL" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} />
            <input className="input" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
            <div className="flex gap-2">
                <button className="btn-secondary" type="button" onClick={() => onDone?.()}>Cancel</button>
                <button className="btn-primary" type="button" onClick={submit}>Submit</button>
            </div>
        </div>
    );
}
