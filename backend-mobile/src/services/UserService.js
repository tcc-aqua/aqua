import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import Condominio from "../models/Condominio.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import CepService from "./CepService.js"; 

export default class UserService {

  // Registro de usuário (casa ou apartamento, responsável ou dependente)
  static async register(data) {
    const { codigo_acesso, residencia_type, name, email, cpf, password, numero, bloco, cep, sensor_id } = data;

    let userData = {
      name,
      email,
      cpf,
      password,
      role: "morador",
    };

    if (!codigo_acesso) {
      // === Cadastro de casa (responsável principal) ===
      if (residencia_type !== "casa") {
        throw new Error("Para cadastrar uma casa, residencia_type deve ser 'casa'");
      }

      if (!sensor_id) throw new Error("sensor_id obrigatório para cadastro de casa");
      if (!cep) throw new Error("CEP obrigatório para cadastro de casa");

      // Busca endereço pelo CEP
      const endereco = await CepService.buscarCep(cep);

      const casa = await Casa.create({
        logradouro: endereco.logradouro,
        numero: numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        uf: endereco.uf,
        estado: endereco.uf, // opcional: você pode mapear para nome do estado
        cep: endereco.cep,
        numero_moradores: 1,
        sensor_id: sensor_id,
        codigo_acesso: nanoid(6).toUpperCase(),
      });

      userData = {
        ...userData,
        type: "casa",
        residencia_type: "casa",
        residencia_id: casa.id,
        responsavel_id: null
      };

      const user = await User.create(userData);
      return { user, residencia: casa };
    }

    // === Cadastro dependente ou responsável de apartamento ===
    if (residencia_type === "casa") {
      // Dependente de casa
      const casa = await Casa.findOne({ where: { codigo_acesso } });
      if (!casa) throw new Error("Código da casa inválido");

      userData = {
        ...userData,
        type: "casa",
        residencia_type: "casa",
        residencia_id: casa.id,
        responsavel_id: casa.responsavel_id || casa.id // vincula ao responsável
      };

      const user = await User.create(userData);
      return { user, residencia: casa };
    }

    if (residencia_type === "apartamento") {
      // Verifica se é responsável criando apartamento ou dependente
      const condominio = await Condominio.findOne({ where: { codigo_acesso } });
      if (!condominio) {
        // Pode ser um código de apartamento existente
        const apartamento = await Apartamento.findOne({ where: { codigo_acesso } });
        if (!apartamento) throw new Error("Código do apartamento inválido");

        // Dependente de apartamento
        userData = {
          ...userData,
          type: "condominio",
          residencia_type: "apartamento",
          residencia_id: apartamento.id,
          responsavel_id: apartamento.responsavel_id // responsável do apartamento
        };

        const user = await User.create(userData);
        return { user, residencia: apartamento };
      } else {
        // Responsável criando novo apartamento
        if (!numero) throw new Error("Número do apartamento é obrigatório");
        const apartamento = await Apartamento.create({
          condominio_id: condominio.id,
          numero,
          bloco: bloco || null,
          codigo_acesso: nanoid(6).toUpperCase(),
          numero_moradores: 1,
          sensor_id: sensor_id || null,
        });

        userData = {
          ...userData,
          type: "condominio",
          residencia_type: "apartamento",
          residencia_id: apartamento.id,
          responsavel_id: null
        };

        const user = await User.create(userData);
        return { user, residencia: apartamento };
      }
    }

    throw new Error("Tipo de residência inválido");
  }

  // Login padrão
  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Senha inválida");

    return user; 
  }
}
