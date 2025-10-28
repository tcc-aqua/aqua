import { z } from "zod";

export const createCondominioDTO = z.object({
    name: z.string(),
    numero: z.string(),
    cep: z.string().min(8).max(9),
    sindico_id: z.string().uuid().optional()
})