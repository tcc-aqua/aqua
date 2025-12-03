import { z } from "zod";

export const registerCondominioSchema = z.object({
    sindico: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        cpf: z.string().min(11),
        password: z.string().min(6)
    }),
    condominio: z.object({
        name: z.string().min(3),
        cep: z.string().min(8),
        numero: z.string(),
        logradouro: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        uf: z.string().length(2).optional()
    })
});