import {z} from "zod";

export const updateAdminDTO = z.object({
    email: z.string().email().optional(),
    role: z.enum(['superadmin', 'admin']).optional(),
});