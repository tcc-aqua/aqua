import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório."),
  email: z.string().email("Formato de e-mail inválido."),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  residencia_type: z.enum(["casa", "apartamento"]),
  codigo_acesso: z.string().optional(), // Obrigatório para dependentes ou para criar apartamento
  cep: z.string().optional(),           // Obrigatório para cadastro de casa
  numero: z.string().optional(),        // Obrigatório para casa ou apartamento
  bloco: z.string().optional(),         // Opcional para apartamento
  sensor_id: z.number().optional()      // Obrigatório para criar casa
})
.refine((data) => {
    // Se for do tipo 'casa' e não for um dependente (sem codigo_acesso), CEP, número e sensor_id são obrigatórios.
    if (data.residencia_type === "casa" && !data.codigo_acesso) {
    return !!data.cep && !!data.numero && !!data.sensor_id;
    }
    return true;
}, {
    message: "Para cadastro de casa, é necessário informar CEP, Número e ID do Sensor.",
    path: ["cep", "numero", "sensor_id"]
})
.refine((data) => {
    // Se for do tipo 'apartamento' e não for um dependente, número e código de acesso são obrigatórios.
    if (data.residencia_type === "apartamento" && !data.codigo_acesso) {
    return !!data.numero && !!data.codigo_acesso;
    }
    // Se for um dependente de apartamento, o código de acesso é obrigatório
    if (data.residencia_type === "apartamento" && data.codigo_acesso) {
        return !!data.numero;
    }
    return true;
}, {
    message: "Para criar um apartamento, é necessário informar o Número e o Código de Acesso do condomínio.",
    path: ["numero", "codigo_acesso"]
})
.refine((data) => {
    // Se um código de acesso for informado (indicando um dependente), o tipo de residência também deve ser informado.
    if (data.codigo_acesso && !data.residencia_type) {
    return false;
    }
    return true;
}, {
    message: "O tipo de residência é obrigatório quando se informa um código de acesso.",
    path: ["residencia_type"]
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});