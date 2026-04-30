import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Email o telefono obligatorio"
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"]
  });
