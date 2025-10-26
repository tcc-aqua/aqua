import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import Condominio from "../models/Condominio.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import CepService from "./CepService.js";

export default class UserService {
  static async register(data) {
    const { codigo_acesso, residencia_type, name, email, cpf, password, numero, bloco, cep, sensor_id } = data;

    // Cadastro de nova CASA
    if (!codigo_acesso && residencia_type === "casa") {
      if (!sensor_id) throw new Error("sensor_id obrigatório para cadastro de casa");
      if (!cep) throw new Error("CEP obrigatório para cadastro de casa");

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

      const endereco = await CepService.buscarCep(cep);

      const casa = await Casa.create({
        logradouro: endereco.logradouro,
        numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        uf: endereco.uf,
        estado: endereco.uf,
        cep: endereco.cep,
        numero_moradores: 1,
        sensor_id,
        codigo_acesso: nanoid(6).toUpperCase(),
        responsavel_id: user.id
      });

      user.residencia_id = casa.id;
      await user.save();

      return { user, residencia: casa };
    }

    // Cadastro de DEPENDENTE de CASA existente
    if (residencia_type === "casa" && codigo_acesso) {
      const casa = await Casa.findOne({ where: { codigo_acesso } });
      if (!casa) throw new Error("Código da casa inválido");
      if (!casa.responsavel_id) throw new Error("Não é possível cadastrar dependente: casa ainda não possui responsável");

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

    // Cadastro de APARTAMENTO
    if (residencia_type === "apartamento") {
      const condominio = await Condominio.findOne({ where: { codigo_acesso } });

      if (!condominio) {
        // Código do apartamento direto (dependente)
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
      } else {
        // Criando novo apartamento dentro do condomínio
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

        const apartamento = await Apartamento.create({
          condominio_id: condominio.id,
          numero,
          bloco: bloco || null,
          codigo_acesso: nanoid(6).toUpperCase(),
          numero_moradores: 1,
          sensor_id: sensor_id || null,
          responsavel_id: user.id
        });

        user.residencia_id = apartamento.id;
        await user.save();

        return { user, residencia: apartamento };
      }
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
}
