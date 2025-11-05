"use client";

import { useState } from "react";

export default function UploadToS3({
    onUploaded,
}: { onUploaded: (url: string) => void }) {
    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFile(file: File) {
        setError(null);
        setUploading(true);
        setProgress(0);

        const ext = file.name.split(".").pop();
        const res = await fetch("/api/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentType: file.type, ext }),
        });
        const { uploadUrl, publicUrl, error } = await res.json();
        if (!res.ok) { setError(error || "Failed to sign"); setUploading(false); return; }

        await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        }).then(async (r) => {
            if (!r.ok) throw new Error("Upload failed");
            setProgress(100);
            onUploaded(publicUrl);
        }).catch((e) => setError(e.message))
            .finally(() => setUploading(false));
    }

    return (
        <div className="space-y-2">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-900/60 p-3"
            />
            {uploading && <div className="text-sm text-slate-400">Uploading… {progress}%</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
        </div>
    );
}
