// app/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signInAction } from "@/lib/auth-actions";

// Zod schema
const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Min 6 characters"),
  remember: z.boolean().default(false),
});

type FormValues = z.infer<typeof SignInSchema>;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

export default function SignInPage() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // validate a single field (used onBlur)
  function validateField<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    const res = z.object({ [key]: (SignInSchema.shape as any)[key] }).safeParse({ [key]: val });
    return res.success ? undefined : res.error.issues[0]?.message;
  }

  function handleChange<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    // live-validate that one field
    setErrors((e) => ({ ...e, [key]: validateField(key, val) }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = SignInSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormValues;
        next[k] = issue.message;
      }
      setErrors(next);
      return;
    }

    setLoading(true);
    try {
      await signInAction(parsed.data);
      router.replace("/my-movies");
    } catch (err: any) {
      setFormError(err?.message ?? "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  // helper to compose input classes:
  // - keep your `.input`
  // - add green ring on focus
  // - add red ring when error exists
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
