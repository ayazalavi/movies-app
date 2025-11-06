import Link from "next/link";

// app/signin/page.tsx
export default function NoMovies() {
    return (

        <div className="flex flex-col items-center gap-[40px] mx-[24px]">
            <h1 className="text-center md:text-5xl text-[32px] font-semibold" > Your movie list is empty</h1 >
            <Link href={"/my-movies/new"}><button className="btn-primary h-[56px] px-[28px] w-full md:w-auto">Add a new movie</button></Link>
        </div >

    );
}
