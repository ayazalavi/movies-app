// app/signin/page.tsx
export default function NoMovies() {
    return (

        <div className="flex flex-col items-center gap-[40px] mx-[24px]">
            <h1 className="text-center text-5xl font-semibold" > Your movie list is empty</h1 >
            <button className="btn-primary h-[56px] px-[28px] w-full md:w-auto">Add a new movie</button>
        </div >

    );
}
