import {z} from 'zod';

export const atribuirSindicoDTO = z.object({
    sindico_id: z.string().uuid()
})