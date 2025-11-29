export async function signInAction(data: { email: string; password: string; remember: boolean }) {

    return true;
}

export async function logoutAction() {
    const res = await fetch(`${process.env.API_BASE}/auth/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Logout failed");
    }
    return true;
}
