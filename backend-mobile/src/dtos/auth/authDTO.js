import { z } from "zod";

export const registerUserSchema = z
  .object({
    // Dados básicos do usuário
    name: z.string().min(3, "O nome é obrigatório."),
    email: z.string().email("Formato de e-mail inválido."),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),

    // Tipo de residência
    residencia_type: z.enum(["casa", "apartamento"], {
      required_error: "O tipo de residência é obrigatório.",
    }),

    // Campos de residência (simplificados)
    codigo_acesso: z.string().optional(), // usado para dependentes ou para criar apê em condomínio
    cep: z.string().optional(), // obrigatório apenas para casa nova
    numero: z.string().optional(), // número da casa ou do apê
    bloco: z.string().optional(), // opcional para apê
    numero_moradores: z.coerce.number().optional(),
  })
  // 🔹 Regra 1: CASA NOVA (sem código de acesso)
  .refine(
    (data) => {
      if (data.residencia_type === "casa" && !data.codigo_acesso) {
        // casa nova precisa de cep e número
        return !!data.cep && !!data.numero;
      }
      return true;
    },
    {
      message: "Para cadastrar uma nova casa, informe o CEP e o número da residência.",
      path: ["cep"],
    }
  )
  // 🔹 Regra 2: DEPENDENTE DE CASA (com código de acesso)
  .refine(
    (data) => {
      if (data.residencia_type === "casa" && data.codigo_acesso) {
        return true; // só precisa do código
      }
      return true;
    },
    {
      message: "Informe o código de acesso da casa do responsável.",
      path: ["codigo_acesso"],
    }
  )
  // 🔹 Regra 3: NOVO APARTAMENTO (código do condomínio + número do apê)
  .refine(
    (data) => {
      if (data.residencia_type === "apartamento" && data.codigo_acesso) {
        return !!data.numero;
      }
      return true;
    },
    {
      message: "Para criar um novo apartamento, o número do apê é obrigatório.",
      path: ["numero"],
    }
  )
  // 🔹 Regra 4: DEPENDENTE DE APARTAMENTO (código do apê existente)
  .refine(
    (data) => {
      if (data.residencia_type === "apartamento" && !data.codigo_acesso) {
        return false; // não pode cadastrar sem o código do apê
      }
      return true;
    },
    {
      message: "Para entrar como dependente em um apartamento, informe o código de acesso.",
      path: ["codigo_acesso"],
    }
  );

export const loginUserSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
