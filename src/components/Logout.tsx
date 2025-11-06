// Example: in your header component
"use client";
import { logoutAction } from "@/lib/auth-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    return (
        <button onClick={async () => {
            await logoutAction();
            router.replace("/");
        }} className="flex gap-3 items-center"> <span className="font-bold text-base text-white hidden md:block">Logout</span> <Image src={"/logout.svg"} width={32} height={32} alt="" /></button>
    );
}
