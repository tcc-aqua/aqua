import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import Condominio from "../models/Condominio.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import CepService from "./CepService.js";
import Sensor from "../models/Sensor.js";

export default class UserService {

  static async register(data) {
    const { codigo_acesso, residencia_type, name, email, cpf, password, numero, bloco, cep } = data;

    if (!codigo_acesso && residencia_type === "casa") {
      if (!cep || !numero) throw new Error("CEP e Número obrigatórios para cadastro de casa.");

      // cria usuário responsável
      const user = await User.create({
        name,
        email,
        cpf,
        password,
        type: "casa",
        role: "morador",
        residencia_type: "casa",
        residencia_id: null,
        responsavel_id: null
      });

      const endereco = await CepService.buscarCep(cep);

      // cria sensor automaticamente
      const sensor = await Sensor.create({
        codigo: nanoid(10),
        status: "ativo",
        consumo_total: 0,
        ultimo_envio: new Date()
      });

      // cria a casa e vincula o sensor
      const casa = await Casa.create({
        logradouro: endereco.logradouro,
        numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        uf: endereco.uf,
        cep: endereco.cep,
        numero_moradores: 1,
        sensor_id: sensor.id,
        codigo_acesso: nanoid(6).toUpperCase(),
        responsavel_id: user.id
      });

      // atualiza residencia_id do usuário
      user.residencia_id = casa.id;
      await user.save();

      return { user, residencia: casa, sensor };
    }

    if (residencia_type === "casa" && codigo_acesso) {
      const casa = await Casa.findOne({ where: { codigo_acesso } });
      if (!casa) throw new Error("Código da casa inválido");
      if (!casa.responsavel_id) throw new Error("Casa ainda não possui responsável");

      const user = await User.create({
        name,
        email,
        cpf,
        password,
        type: "casa",
        role: "morador",
        residencia_type: "casa",
        residencia_id: casa.id,
        responsavel_id: casa.responsavel_id
      });

      casa.numero_moradores += 1;
      await casa.save();

      return { user, residencia: casa };
    }

    if (residencia_type === "apartamento") {
      const condominio = await Condominio.findOne({ where: { codigo_acesso } });

      // dependente de apartamento existente
      if (!condominio) {
        const apartamento = await Apartamento.findOne({ where: { codigo_acesso } });
        if (!apartamento) throw new Error("Código do apartamento inválido");

        const user = await User.create({
          name,
          email,
          cpf,
          password,
          type: "condominio",
          role: "morador",
          residencia_type: "apartamento",
          residencia_id: apartamento.id,
          responsavel_id: apartamento.responsavel_id
        });

        apartamento.numero_moradores += 1;
        await apartamento.save();

        return { user, residencia: apartamento };
      }

      // criar novo apartamento no condomínio
      if (!numero) throw new Error("Número do apartamento é obrigatório");

      const user = await User.create({
        name,
        email,
        cpf,
        password,
        type: "condominio",
        role: "morador",
        residencia_type: "apartamento",
        residencia_id: null,
        responsavel_id: null
      });

      // cria sensor automaticamente
      const sensor = await Sensor.create({
        codigo: nanoid(10),
        status: "ativo",
        consumo_total: 0,
        ultimo_envio: new Date()
      });

      const apartamento = await Apartamento.create({
        condominio_id: condominio.id,
        numero,
        bloco: bloco || null,
        codigo_acesso: nanoid(6).toUpperCase(),
        numero_moradores: 1,
        sensor_id: sensor.id,
        responsavel_id: user.id
      });

      user.residencia_id = apartamento.id;
      await user.save();

      return { user, residencia: apartamento, sensor };
    }

    throw new Error("Tipo de residência inválido");
  }


  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Senha inválida");

    return user;
  }

  static async getMe(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('Usuário não encontrado');
      return user;
    } catch (error) {
      console.error("erro em listar dados de usuário", error);
      throw error;
    }
  }

}
