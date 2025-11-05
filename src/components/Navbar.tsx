"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    return (
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
                <Link href="/movies" className="text-lg font-semibold">🎬 My movies</Link>

                <nav className="flex items-center gap-3">
                    <Link
                        href="/movies/new"
                        className={`btn-primary ${pathname?.startsWith("/movies/new") ? "ring-2 ring-emerald-400" : ""}`}
                    >
                        + Add a new movie
                    </Link>
                    {/* Replace with NextAuth signIn/signOut later */}
                    <Link href="/" className="btn bg-slate-800 hover:bg-slate-700">Logout</Link>
                </nav>
            </div>
        </header>
    );
}
