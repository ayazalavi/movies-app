import z from "zod";
export declare const SignInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    remember: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type SigninInput = z.infer<typeof SignInSchema>;
export type SigninFieldErrors = Partial<Record<keyof SigninInput, string>>;
