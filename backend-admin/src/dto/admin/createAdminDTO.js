import { z } from 'zod';

export const createAdminDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
