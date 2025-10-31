import { z } from "zod";

export const registerUserSchema = z
  .object({
    // Campos de usuário
    name: z.string().min(3, "O nome é obrigatório."),
    email: z.string().email("Formato de e-mail inválido."),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    residencia_type: z.enum(["casa", "apartamento"], {
      required_error: "O tipo de residência é obrigatório.",
    }),
    
    // Campos de residência (completos)
    codigo_acesso: z.string().optional(), 
    cep: z.string().optional(),           
    numero: z.string().optional(),      
    bloco: z.string().optional(),
    logradouro: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    estado: z.string().optional(),
    numero_moradores: z.number().optional(),
  })
  // Validação para CADASTRO DE CASA NOVA
  .refine(
    (data) => {
      // Se for uma casa e NÃO tiver código de acesso, é uma casa nova.
      // Portanto, CEP, número, logradouro e cidade são obrigatórios.
      if (data.residencia_type === "casa" && !data.codigo_acesso) {
        return !!data.cep && !!data.numero && !!data.logradouro && !!data.cidade;
      }
      return true; // Para outros casos, essa validação passa.
    },
    {
      message: "Para cadastrar uma nova casa, todos os campos de endereço são necessários.",
      path: ["cep"], // Mostra o erro associado ao campo CEP.
    }
  )
  // Validação para CADASTRO DE APARTAMENTO NOVO
  .refine(
    (data) => {
      // Se for um apartamento e tiver código de acesso (do condomínio), é um apê novo.
      // Portanto, o número do apê é obrigatório.
      if (data.residencia_type === "apartamento" && data.codigo_acesso) {
        return !!data.numero;
      }
      return true; // Para outros casos, essa validação passa.
    },
    {
      message: "Para criar um novo apartamento, o número é obrigatório.",
      path: ["numero"], // Mostra o erro associado ao campo Número.
    }
  );

export const loginUserSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});