import { z } from "zod";

export const updateNameCondominioDTO = z.object({
    name: z.string(),
})