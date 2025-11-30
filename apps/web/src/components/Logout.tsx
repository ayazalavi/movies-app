// Example: in your header component
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    async function logoutAction() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/logout`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        console.log(await res.json())
        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error || "Logout failed");
        }

        localStorage.clear();
        return true;
    }
    return (
        <button onClick={async () => {
            await logoutAction();
            router.replace("/");
        }} className="flex gap-3 items-center"> <span className="font-bold text-base text-white hidden md:block">Logout</span> <Image src={"/logout.svg"} width={32} height={32} alt="" /></button>
    );
}
