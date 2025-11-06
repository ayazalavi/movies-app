// components/Header.tsx
"use client";

import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type HeaderProps = {
    title: string;
    titleIcon?: React.ReactNode;
    rightSlot?: React.ReactNode;
};

export default function Header({ title, titleIcon, rightSlot }: HeaderProps) {
    return (
        <header className="flex items-center justify-between flex-row w-full">
            <div className="flex items-center gap-3 justify-items-center">
                <h1 className="md:text-5xl text-[32px] font-semibold text-white">{title}</h1>
                {titleIcon}
            </div>
            {rightSlot}
        </header>
    );
}
