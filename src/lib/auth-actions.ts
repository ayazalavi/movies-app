// lib/auth-actions.ts
"use client";

export async function signInAction(data: { email: string; password: string; remember: boolean }) {
    const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Sign in failed");
    }
    return true;
}

export async function logoutAction() {
    await fetch("/api/auth/logout", { method: "POST" });
}
