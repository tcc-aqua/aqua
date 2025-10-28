import { z } from "zod";

export const updateCondominioDTO = z.object({
    name: z.string().optional(),
    numero: z.string().optional(),
    cep: z.string().min(8).max(9).optional(),
    sindico_id: z.string().uuid().optional()
})