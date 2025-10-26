    import { z } from "zod";

    export const registerUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    residencia_type: z.enum(["casa", "apartamento"]),
    codigo_acesso: z.string().optional(), // obrigatório apenas para dependentes
    cep: z.string().optional(),           // obrigatório apenas para cadastro de casa
    numero: z.string().optional(),        // obrigatório para apartamento ao criar
    bloco: z.string().optional(),         // opcional para apartamento ao criar
    sensor_id: z.number().optional()      // obrigatório para criar casa
    })
    .refine((data) => {
        if (data.residencia_type === "casa" && !data.codigo_acesso) {
        return !!data.cep && !!data.sensor_id;
        }
        return true;
    }, {
        message: "Para cadastro de casa é necessário informar CEP e sensor_id",
        path: ["cep", "sensor_id"]
    })
    .refine((data) => {
        if (data.residencia_type === "apartamento" && !data.codigo_acesso) {
        return !!data.numero;
        }
        return true;
    }, {
        message: "Para criar apartamento é necessário informar número e código do condomínio",
        path: ["numero", "codigo_acesso"]
    })
    .refine((data) => {
        if ((data.codigo_acesso) && !data.residencia_type) {
        return false;
        }
        return true;
    }, {
        message: "residencia_type é obrigatório quando se informa código_acesso",
        path: ["residencia_type"]
    });

    export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
    });

