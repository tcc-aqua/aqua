import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import Condominio from "../models/Condominio.js";
import Sensor from "../models/Sensor.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export default class UserService {

  static async register(data) {
    // --- ALTERAÇÃO 1: Recebendo todos os dados do formulário validados pelo DTO ---
    const { 
      name, email, cpf, password, residencia_type, 
      codigo_acesso, cep, logradouro, numero, bairro, 
      cidade, uf, estado, bloco, numero_moradores 
    } = data;

    // --- LÓGICA PARA CRIAÇÃO DE UMA NOVA CASA ---
    // Ocorre quando o usuário se cadastra como 'casa' e NÃO fornece um código de acesso.
    if (residencia_type === "casa" && !codigo_acesso) {
      
      // A validação de campos obrigatórios agora é feita primariamente pelo authDTO.js
      if (!cep || !numero || !logradouro || !cidade || !uf) {
        throw new Error("Para cadastrar uma nova casa, os campos de endereço são obrigatórios.");
      }

      // 1. Cria o usuário que será o responsável pela residência.
      const user = await User.create({
        name,
        email,
        cpf,
        password, // O hook no model User.js irá hashear a senha
        type: "casa",
        role: "morador",
        residencia_type: "casa",
        residencia_id: null, // Será atualizado após a casa ser criada
        responsavel_id: null  // Ele é o seu próprio responsável
      });

      // 2. Cria um novo sensor para a residência.
      const sensor = await Sensor.create({
        codigo: nanoid(10).toUpperCase(),
        status: "ativo",
      });

      // 3. Cria a casa no banco de dados com os dados completos do formulário.
      const casa = await Casa.create({
        // --- ALTERAÇÃO 2: Usando os dados completos do formulário ---
        logradouro,
        numero,
        bairro,
        cidade,
        uf,
        estado,
        cep,
        // --- ALTERAÇÃO 3: Usando o número de moradores vindo do formulário ---
        numero_moradores: parseInt(numero_moradores, 10) || 1,
        sensor_id: sensor.id,
        codigo_acesso: nanoid(6).toUpperCase(), // Gera um código único para esta casa
        responsavel_id: user.id
      });

      // 4. Vincula o ID da casa recém-criada ao registro do usuário.
      user.residencia_id = casa.id;
      await user.save();

      return { user, residencia: casa, sensor };
    }

    // --- LÓGICA PARA ENTRAR EM UMA CASA EXISTENTE (MORADOR DEPENDENTE) ---
    // Ocorre quando o usuário se cadastra como 'casa' e fornece um código de acesso.
    if (residencia_type === "casa" && codigo_acesso) {
      const casa = await Casa.findOne({ where: { codigo_acesso } });
      if (!casa) throw new Error("Código de acesso da casa inválido ou não encontrado.");
      if (!casa.responsavel_id) throw new Error("Esta casa ainda não possui um morador responsável definido.");

      // Cria o novo usuário como um dependente do responsável da casa.
      const user = await User.create({
        name, email, cpf, password,
        type: "casa",
        role: "morador",
        residencia_type: "casa",
        residencia_id: casa.id,
        responsavel_id: casa.responsavel_id
      });

      // Incrementa o número de moradores da casa.
      casa.numero_moradores += 1;
      await casa.save();

      return { user, residencia: casa };
    }
    
    // --- LÓGICA PARA APARTAMENTOS ---
    if (residencia_type === "apartamento") {
      // Cenário 1: Usuário quer criar um NOVO apartamento dentro de um condomínio.
      // Ele deve fornecer o código de acesso do CONDOMÍNIO.
      const condominio = await Condominio.findOne({ where: { codigo_acesso } });

      if (condominio) {
        if (!numero) throw new Error("O número do apartamento é obrigatório para um novo cadastro.");

        // 1. Cria o usuário que será o responsável pelo apartamento.
        const user = await User.create({
          name, email, cpf, password,
          type: "condominio",
          role: "morador",
          residencia_type: "apartamento",
          residencia_id: null, // Será atualizado depois
          responsavel_id: null
        });

        // 2. Cria um novo sensor para o apartamento.
        const sensor = await Sensor.create({
          codigo: nanoid(10).toUpperCase(),
          status: "ativo",
        });

        // 3. Cria o apartamento com os dados completos.
        const apartamento = await Apartamento.create({
          condominio_id: condominio.id,
          numero,
          bloco: bloco || null,
          codigo_acesso: nanoid(6).toUpperCase(), // Gera um código único para este APARTAMENTO
          // --- ALTERAÇÃO 3: Usando o número de moradores vindo do formulário ---
          numero_moradores: parseInt(numero_moradores, 10) || 1,
          sensor_id: sensor.id,
          responsavel_id: user.id
        });

        // 4. Vincula o ID do apartamento ao usuário.
        user.residencia_id = apartamento.id;
        await user.save();

        return { user, residencia: apartamento, sensor };
      }

      // Cenário 2: Usuário quer entrar em um APARTAMENTO existente (dependente).
      // Ele deve fornecer o código de acesso do APARTAMENTO.
      const apartamentoExistente = await Apartamento.findOne({ where: { codigo_acesso } });
      if (apartamentoExistente) {
        if (!apartamentoExistente.responsavel_id) throw new Error("Este apartamento ainda não possui um morador responsável.");

        const user = await User.create({
          name, email, cpf, password,
          type: "condominio",
          role: "morador",
          residencia_type: "apartamento",
          residencia_id: apartamentoExistente.id,
          responsavel_id: apartamentoExistente.responsavel_id
        });

        apartamentoExistente.numero_moradores += 1;
        await apartamentoExistente.save();

        return { user, residencia: apartamentoExistente };
      }
      
      // Se não encontrou nem condomínio nem apartamento, o código é inválido.
      throw new Error("Código de Acesso inválido. Verifique se é o código do Condomínio (para criar um novo apê) ou de um Apartamento (para entrar como dependente).");
    }

    // Se nenhuma das condições acima for atendida, algo está errado.
    throw new Error("Tipo de residência ou condição de cadastro inválida.");
  }



  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("E-mail ou senha inválidos.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("E-mail ou senha inválidos.");

    return user;
  }

  static async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Boa prática: não retornar a senha
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }
}