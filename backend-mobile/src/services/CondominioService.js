import Condominio from "../models/Condominio.js";
import User from "../models/User.js";
import CepService from "./CepService.js";
import { nanoid } from "nanoid";
import sequelize from "../config/sequelize.js";

export default class CondominioService {
    static async create(data) {
        const transaction = await sequelize.transaction();

        try {
            const { sindico, condominio } = data;

            const existingUser = await User.findOne({ where: { email: sindico.email }, transaction });
            if (existingUser) {
                throw new Error("E-mail já cadastrado.");
            }

            const existingCpf = await User.findOne({ where: { cpf: sindico.cpf }, transaction });
            if (existingCpf) {
                throw new Error("CPF já cadastrado.");
            }

            let endereco = { ...condominio };
            if (!condominio.logradouro || !condominio.cidade) {
                const cepData = await CepService.buscarCep(condominio.cep);
                endereco = {
                    ...condominio,
                    logradouro: cepData.logradouro,
                    bairro: cepData.bairro,
                    cidade: cepData.cidade,
                    uf: cepData.uf
                };
            }

            const userSindico = await User.create({
                name: sindico.name,
                email: sindico.email,
                cpf: sindico.cpf,
                password: sindico.password,
                type: 'condominio',
                role: 'sindico',
                status: 'ativo',
                residencia_type: 'apartamento' 
            }, { transaction });

            const newCondominio = await Condominio.create({
                name: condominio.name,
                logradouro: endereco.logradouro,
                numero: condominio.numero,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                uf: endereco.uf,
                estado: endereco.uf, 
                cep: condominio.cep,
                codigo_acesso: nanoid(6).toUpperCase(),
                sindico_id: userSindico.id,
                status: 'ativo'
            }, { transaction });

            await transaction.commit();

            const sindicoResponse = userSindico.toJSON();
            delete sindicoResponse.password;

            return {
                message: "Condomínio e Síndico criados com sucesso!",
                condominio: newCondominio,
                sindico: sindicoResponse
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getAll() {
        return await Condominio.findAll();
    }
}