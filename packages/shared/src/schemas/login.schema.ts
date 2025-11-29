import z from "zod";

export const SignInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(1, "Password is required").min(6, "Min 6 characters"),
    remember: z.boolean().default(false),
});

export type SigninInput = z.infer<typeof SignInSchema>;
export type SigninFieldErrors = Partial<Record<keyof SigninInput, string>>;
