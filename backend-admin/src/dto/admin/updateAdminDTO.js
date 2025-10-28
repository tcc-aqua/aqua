import z from "zod";

export const updateAdminDTO = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['superadmin', 'admin']).optional(),
});