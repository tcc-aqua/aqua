import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z.string().min(3, "O nome é obrigatório."),
    email: z.string().email("Formato de e-mail inválido."),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    residencia_type: z.enum(["casa", "apartamento"], {
      required_error: "O tipo de residência é obrigatório.",
    }),
    codigo_acesso: z.string().optional(), 
    cep: z.string().optional(),           
    numero: z.string().optional(),      
    bloco: z.string().optional(),        
  })

  .refine(
    (data) => {
      if (data.residencia_type === "casa" && !data.codigo_acesso) {
        return !!data.cep && !!data.numero;
      }
      return true;
    },
    {
      message: "Para cadastro de casa, informe CEP e Número.",
      path: ["cep", "numero"],
    }
  )

  .refine(
    (data) => {
      if (data.residencia_type === "apartamento" && !data.codigo_acesso) {
        return !!data.numero;
      }

      if (data.residencia_type === "apartamento" && data.codigo_acesso) {
        return !!data.codigo_acesso;
      }

      return true;
    },
    {
      message: "Para criar ou entrar em um apartamento, informe o Número e/ou Código de Acesso.",
      path: ["numero", "codigo_acesso"],
    }
  );

export const loginUserSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
