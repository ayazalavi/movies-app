"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  SigninFieldErrors,
  SignInSchema,
  type SigninInput,
} from '@moviesapp/shared/schemas/login.schema';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function SignInPage() {

  const router = useRouter();

  const [values, setValues] = useState<SigninInput>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<SigninFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // validate a single field (used onBlur)
  function validateField<K extends keyof SigninInput>(key: K, val: SigninInput[K]) {
    const res = z.object({ [key]: (SignInSchema.shape as any)[key] }).safeParse({ [key]: val });
    return res.success ? undefined : res.error.issues[0]?.message;
  }

  function handleChange<K extends keyof SigninInput>(key: K, val: SigninInput[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    // live-validate that one field
    setErrors((e) => ({ ...e, [key]: validateField(key, val) }));
  }

  async function signinNow(data: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const j = await res.json().catch(() => ({}));
    if (!j.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Sign in failed");
    }


    if (typeof window !== "undefined")
      localStorage.setItem("token", j.access_token)

  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = SignInSchema.safeParse(values);
    if (!parsed.success) {
      const next: SigninFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof SigninInput;
        next[k] = issue.message;
      }
      setErrors(next);
      return;
    }

    setLoading(true);
    try {
      await signinNow(parsed.data);
      router.replace("/my-movies");
    } catch (err: any) {
      setFormError(err?.message ?? "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }


  const inputCx = (hasError: boolean) =>
    `input ${hasError ? "ring-2 ring-error" : ""}`;

  return (
    <div className="w-full max-w-md grid gap-[40px]">
      <h1 className="mb-[16px] text-center md:text-6xl text-5xl font-semibold">Sign in</h1>

      <form className="grid gap-[24px]" onSubmit={onSubmit} noValidate>
        {/* Email */}
        <div>
          <input
            className={inputCx(!!errors.email)}
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() =>
              setErrors((e) => ({ ...e, email: validateField("email", values.email) }))
            }
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-error">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            className={inputCx(!!errors.password)}
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() =>
              setErrors((e) => ({ ...e, password: validateField("password", values.password) }))
            }
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm text-error">
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me */}
        <label className="flex items-center justify-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            name="remember"
            className="checkbox"
            checked={values.remember ?? false}
            onChange={(e) => handleChange("remember", e.target.checked)}
          />
          Remember me
        </label>

        {/* Form-level error (bad credentials, etc.) */}
        {formError && (
          <p className="text-error text-center text-sm" role="alert">
            {formError}
          </p>
        )}

        {/* Button with active/disabled states */}
        <button
          className="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
