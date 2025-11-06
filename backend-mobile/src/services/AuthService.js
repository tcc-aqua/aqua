import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import Condominio from "../models/Condominio.js";
import Sensor from "../models/Sensor.js";
import CepService from "./CepService.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export default class UserService {

  static async register(data) {
    const {
      name, email, cpf, password,
      residencia_type, codigo_acesso,
      cep, numero, bloco, numero_moradores
    } = data;

    if (!residencia_type)
      throw new Error("O tipo de residência é obrigatório (casa ou apartamento).");

    // ======================================
    // RESPONSÁVEL DE CASA
    // ======================================
    if (residencia_type === "casa" && !codigo_acesso) {
      if (!cep || !numero)
        throw new Error("CEP e número são obrigatórios para criar uma nova casa.");

      const endereco = await CepService.buscarCep(cep);

      const user = await User.create({
        name,
        email,
        cpf,
        password,
        type: "casa",
        role: "morador",
        residencia_type: "casa",
        responsavel_id: null
      });

      const sensor = await Sensor.create({
        codigo: nanoid(10).toUpperCase(),
        status: "ativo",
        consumo_total: 0
      });

      const casa = await Casa.create({
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        numero,
        cidade: endereco.cidade,
        uf: endereco.uf,
        estado: endereco.uf,
        cep: endereco.cep,
        numero_moradores: parseInt(numero_moradores, 10) || 1,
        sensor_id: sensor.id,
        codigo_acesso: nanoid(6).toUpperCase(),
        responsavel_id: user.id
      });

      user.residencia_id = casa.id;
      await user.save();

      return { message: "Usuário responsável (casa) criado com sucesso.", user, residencia: casa, sensor };
    }

    // ======================================
    // DEPENDENTE DE CASA
    // ======================================
    if (residencia_type === "casa" && codigo_acesso) {
      const casa = await Casa.findOne({ where: { codigo_acesso } });
      if (!casa) throw new Error("Código de acesso inválido.");
      if (!casa.responsavel_id) throw new Error("Esta casa ainda não possui um morador responsável.");

      const user = await User.create({
        name, email, cpf, password,
        type: "casa",
        role: "morador",
        residencia_type: "casa",
        residencia_id: casa.id,
        responsavel_id: casa.responsavel_id
      });

      casa.numero_moradores += 1;
      await casa.save();

      return { message: "Usuário dependente (casa) criado com sucesso.", user, residencia: casa };
    }

    // ======================================
    // RESPONSÁVEL DE APARTAMENTO
    // ======================================
    if (residencia_type === "apartamento" && codigo_acesso) {
      const condominio = await Condominio.findOne({ where: { codigo_acesso } });
      if (!condominio)
        throw new Error("Código de acesso do condomínio inválido.");
      if (!numero)
        throw new Error("Número do apartamento é obrigatório.");

      const user = await User.create({
        name, email, cpf, password,
        type: "condominio",
        role: "morador",
        residencia_type: "apartamento"
      });

      const sensor = await Sensor.create({
        codigo: nanoid(10).toUpperCase(),
        status: "ativo",
        consumo_total: 0
      });

      const apartamento = await Apartamento.create({
        condominio_id: condominio.id,
        numero,
        bloco: bloco || null,
        codigo_acesso: nanoid(6).toUpperCase(),
        numero_moradores: parseInt(numero_moradores, 10) || 1,
        sensor_id: sensor.id,
        responsavel_id: user.id
      });

      user.residencia_id = apartamento.id;
      await user.save();

      return { message: "Usuário responsável (apartamento) criado com sucesso.", user, residencia: apartamento, sensor };
    }

    // ======================================
    // DEPENDENTE DE APARTAMENTO
    // ======================================
    const apartamentoExistente = await Apartamento.findOne({ where: { codigo_acesso } });
    if (apartamentoExistente) {
      if (!apartamentoExistente.responsavel_id)
        throw new Error("Este apartamento ainda não possui um morador responsável.");

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

      return { message: "Usuário dependente (apartamento) criado com sucesso.", user, residencia: apartamentoExistente };
    }

    throw new Error("Fluxo de cadastro inválido.");
  }

  // ======================================
  // LOGIN
  // ======================================
  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("E-mail ou senha inválidos.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("E-mail ou senha inválidos.");

    return user;
  }

  // ======================================
  // PERFIL
  // ======================================
  static async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }
}
