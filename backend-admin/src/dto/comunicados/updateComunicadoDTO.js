import {z} from 'zod';

export const updateComunicado = z.object({
   title: z.string().optional(),
   subject: z.string().optional(),
   addressee: z.enum(["administradores", "usuários"]).optional(),
})