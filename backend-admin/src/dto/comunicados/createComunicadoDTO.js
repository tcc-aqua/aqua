import {z} from 'zod';

export const createComunicado = z.object({
   title: z.string(),
   subject: z.string(),
   addressee: z.enum(["administradores", "usuários"]),
})