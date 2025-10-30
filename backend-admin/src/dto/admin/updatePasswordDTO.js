import {z} from 'zod';

export const updatePasswordDTO = z.object({
    password: z.string()
})