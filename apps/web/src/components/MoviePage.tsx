"use client"
import { useState } from "react";
import Pagination from "@/components/Pagination";

export default function MoviesPage({ totalPages, page }: { totalPages: number, page: number }) {

    function hrefBuilder(page: number) {
        return `/my-movies?page=${page}`
    }

    return (
        <div className="flex items-center justify-center">
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                hrefBuilder={hrefBuilder}
            />
        </div>
    );
}
