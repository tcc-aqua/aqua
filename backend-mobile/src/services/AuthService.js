import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import Condominio from "../models/Condominio.js";
import Sensor from "../models/Sensor.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export default class UserService {

  static async register(data) {
    const { 
      name, email, cpf, password, residencia_type, 
      codigo_acesso, cep, logradouro, numero, bairro, 
      cidade, uf, estado, bloco, numero_moradores 
    } = data;

    if (residencia_type === "casa" && !codigo_acesso) {
      if (!cep || !numero || !logradouro || !cidade || !uf) {
        throw new Error("Para cadastrar uma nova casa, os campos de endereço são obrigatórios.");
      }

      const user = await User.create({
        name, email, cpf, password,
        type: "casa", role: "morador", residencia_type: "casa",
        residencia_id: null, responsavel_id: null
      });

      const sensor = await Sensor.create({
        codigo: nanoid(10).toUpperCase(),
        status: "ativo",
        // --- CORREÇÃO 1/2: Adicionado valor padrão para consumo_total ---
        consumo_total: 0,
      });

      const casa = await Casa.create({
        logradouro, numero, bairro, cidade, uf, estado, cep,
        numero_moradores: parseInt(numero_moradores, 10) || 1,
        sensor_id: sensor.id,
        codigo_acesso: nanoid(6).toUpperCase(),
        responsavel_id: user.id
      });

      user.residencia_id = casa.id;
      await user.save();
      return { user, residencia: casa, sensor };
    }

    if (residencia_type === "casa" && codigo_acesso) {
      const casa = await Casa.findOne({ where: { codigo_acesso } });
      if (!casa) throw new Error("Código de acesso da casa inválido ou não encontrado.");
      if (!casa.responsavel_id) throw new Error("Esta casa ainda não possui um morador responsável definido.");

      const user = await User.create({
        name, email, cpf, password,
        type: "casa", role: "morador", residencia_type: "casa",
        residencia_id: casa.id, responsavel_id: casa.responsavel_id
      });

      casa.numero_moradores += 1;
      await casa.save();
      return { user, residencia: casa };
    }
    
    if (residencia_type === "apartamento") {
      const condominio = await Condominio.findOne({ where: { codigo_acesso } });
      if (condominio) {
        if (!numero) throw new Error("O número do apartamento é obrigatório para um novo cadastro.");

        const user = await User.create({
          name, email, cpf, password,
          type: "condominio", role: "morador", residencia_type: "apartamento",
          residencia_id: null, responsavel_id: null
        });

        const sensor = await Sensor.create({
          codigo: nanoid(10).toUpperCase(),
          status: "ativo",
          // --- CORREÇÃO 2/2: Adicionado valor padrão para consumo_total ---
          consumo_total: 0,
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
        return { user, residencia: apartamento, sensor };
      }

      const apartamentoExistente = await Apartamento.findOne({ where: { codigo_acesso } });
      if (apartamentoExistente) {
        if (!apartamentoExistente.responsavel_id) throw new Error("Este apartamento ainda não possui um morador responsável.");

        const user = await User.create({
          name, email, cpf, password,
          type: "condominio", role: "morador", residencia_type: "apartamento",
          residencia_id: apartamentoExistente.id, responsavel_id: apartamentoExistente.responsavel_id
        });

        apartamentoExistente.numero_moradores += 1;
        await apartamentoExistente.save();
        return { user, residencia: apartamentoExistente };
      }
      
      throw new Error("Código de Acesso inválido. Verifique se é o código do Condomínio (para criar um novo apê) ou de um Apartamento (para entrar como dependente).");
    }

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
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }
}