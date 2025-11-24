import { z } from 'zod';

export const createComunicado = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subject: z.string().min(1, "Assunto é obrigatório"),
  addressee: z.enum(["administradores", "usuários", "sindicos"]),
  condominio_id: z.number().int().optional(),
  casa_id: z.number().int().optional(),
  sindico_id: z.string().uuid().optional(), 
});
