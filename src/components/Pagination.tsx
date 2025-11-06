// components/Pagination.tsx
"use client";

import Link from "next/link";
import clsx from "clsx";

type Props = {
    currentPage: number;          // 1-based
    totalPages: number;
    onPageChange?: (page: number) => void; // use this for client handlers
    hrefBuilder?: (page: number) => string; // or provide a URL for Next <Link>
    className?: string;
    windowSize?: number;          // how many numeric items to show (default 3)
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hrefBuilder,
    className,
    windowSize = 3,
}: Props) {
    if (totalPages <= 1) return null;

    const goto = (p: number) => {
        if (p < 1 || p > totalPages || p === currentPage) return;
        onPageChange?.(p);
    };

    // Compute a small window like: [current-1, current, current+1]
    const half = Math.floor(windowSize / 2);
    const start = Math.max(1, Math.min(currentPage - half, totalPages - windowSize + 1));
    const end = Math.min(totalPages, start + windowSize - 1);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const Item = ({
        children,
        page,
        active = false,
        disabled = false,
        label,
        classes
    }: {
        children: React.ReactNode;
        page?: number;
        active?: boolean;
        disabled?: boolean;
        label?: string;
        classes?: string
    }) => {
        const base =
            "min-w-5 h-8 px-3 rounded-xs grid place-items-center text-base font-bold transition " +
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
        const styles = clsx(
            base,
            active
                ? "bg-primary text-white"
                : "text-white hover:bg-primary",
            disabled && "opacity-40 pointer-events-none",
            classes
        );

        // Link mode if hrefBuilder present & not disabled; otherwise button
        if (hrefBuilder && page && !disabled) {
            return (
                <Link
                    aria-label={label}
                    href={hrefBuilder(page)}
                    className={styles}
                    prefetch={false}
                >
                    {children}
                </Link>
            );
        }
        return (
            <button
                type="button"
                aria-label={label}
                className={styles}
                onClick={() => (page ? goto(page) : undefined)}
                disabled={disabled}
            >
                {children}
            </button>
        );
    };

    return (
        <nav
            aria-label="Pagination"
            className={clsx(
                "inline-flex items-center gap-2 px-2 py-1",
                className
            )}
        >
            <Item
                label="Previous page"
                page={currentPage - 1}
                disabled={currentPage === 1}
                classes="mr-2"
            >
                Prev
            </Item>

            {pages.map((p) => (
                <Item key={p} page={p} active={p === currentPage} label={`Page ${p}`}>
                    {p}
                </Item>
            ))}

            <Item
                label="Next page"
                page={currentPage + 1}
                disabled={currentPage === totalPages}
                classes="ml-2"
            >
                Next
            </Item>
        </nav>
    );
}
