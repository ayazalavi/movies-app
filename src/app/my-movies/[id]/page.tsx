// app/movies/[id]/edit/page.tsx
import Header from "@/components/Header";
import MovieForm from "@/components/MovieForm";
import { prisma } from "@/lib/prisma";
import { updateMovieAction } from "../_actions";

type Props = { params: { id: string } };

export default async function EditMoviePage({ params }: Props) {
    const movie = await prisma.movie.findUnique({
        where: { id: (await params).id },
        select: { id: true, title: true, year: true, posterUrl: true },
    });

    if (!movie) {
        return (
            <main className="mx-auto w-full max-w-5xl px-4 py-16 text-center text-white/70">
                Movie not found.
            </main>
        );
    }

    async function updateAction(fd: FormData) {
        "use server";
        // TODO: call your server action to update (optional new poster + fields)
        // await updateMovie(fd)
    }

    return (
        <main className="mx-auto w-full md:px-[120px] px-6 py-20 md:pt-[120px] md:pb-[89px] grid md:gap-[120px] gap-20">
            <Header title="Edit" />
            <MovieForm
                mode="edit"
                initialData={movie}
                onSubmit={updateMovieAction}
            />
        </main>
    );
}
