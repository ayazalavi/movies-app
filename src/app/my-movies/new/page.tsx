// app/movies/new/page.tsx
import Header from "@/components/Header";
import MovieForm from "@/components/MovieForm";
import { createMovieAction } from "../_actions";

export default function NewMoviePage() {
    async function createAction(fd: FormData) {
        "use server";
        // TODO: call your server action to create (S3 upload + Prisma)
        // await createMovie(fd)
    }

    return (
        <main className="mx-auto w-full md:px-[120px] px-6 py-20 md:pt-[120px] md:pb-[89px] grid md:gap-[120px] gap-20">
            <Header title="Create a new movie" />
            <MovieForm mode="create" onSubmit={createMovieAction} />
        </main>
    );
}
