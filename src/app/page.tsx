// app/signin/page.tsx
export default function SignInPage() {
  return (

    <div className="w-full max-w-md grid gap-[40px]">
      <h1 className="mb-[16px] text-center text-6xl font-semibold">Sign in</h1>

      <form method="post" action="/api/auth/signin" className="grid gap-[24px]">
        <div className="">
          <input className="input" name="email" type="email" placeholder="Email" required />
        </div>
        <div className="">
          <input className="input" name="password" type="password" placeholder="Password" required />
        </div>

        <label className="flex items-center justify-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            name="remember"
            className="checkbox"
          />
          Remember me
        </label>


        <button className="btn-primary">Login</button>
      </form>
    </div>

  );
}
