import { where } from "sequelize";
import Unidade from "../models/Unidade.js";
import sequelizePaginate, { paginate } from 'sequelize-paginate'

export default class UnidadeService {

    static async getAllUnidades(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
            }
            const unidades = await Unidade.paginate(options);
            return unidades;
        } catch (error) {
            console.error("Erro ao listr todas as unidades", error);
            throw error;
        }
    }

    static async getAllUnidadesAtivas(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { status: 'ativo' }
            }
            const unidades = await UnidadeService.paginate(options);
            return unidades;
        } catch (error) {
            console.error('Erro ao listar todas as unidades ativas');
            throw error;
        }
    }

    static async getAllUnidadesInativas(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { status: 'inativo' }
            }
            const unidades = await UnidadeService.paginate(options);
            return unidades;
        } catch (error) {
            console.error('Erro ao listar todas as unidades inativas');
            throw error;
        }
    }

    static async countUnidades() {
        try {
            const unidades = await Unidade.count();
            return unidades;
        } catch (error) {
            console.error('Erro ao listar contagem de unidades.', error);
            throw error;
        }
    }

    static async createUnidades({ condominio_id, numero, bloco, numero_moradores, sensor_id }) {
        try {
            const unidade = await Unidade.create({
                condominio_id, numero, bloco, numero_moradores, sensor_id
            })

            return unidade;
        } catch (error) {
            console.error('Erro ao criar unidade', error);
            throw error;
        }
    }

    static async updateUnidade(id, { numero, bloco, numero_moradores, sensor_id }) {
        try {
            const unidade = await Unidade.findByPk(id);
            if (!unidade) {
                throw new Error('Unidade não encontrada.')
            }
            await unidade.update({
                numero, bloco, numero_moradores, sensor_id
            })
            return unidade;
        } catch (error) {
            console.error('Erro ao atualizar unidade', error);
            throw error;
        }
    }

    static async inativarUnidade(id) {
        try {
            const unidade = await Unidade.findByPk(id);
            if (!unidade) {
                throw new Error('Unidade não encontrada.')
            }
            await unidade.update({
                status: 'inativo'
            })

            return { message: 'Unidade inativada com sucesso!', unidade }
        } catch (error) {
            console.error('Erro ao inativar unidade', error);
            throw error;
        }
    }

    static async ativarUnidade(id) {
        try {
            const unidade = await Unidade.findByPk(id);
            if (!unidade) {
                throw new Error('Unidade não encontrada.')
            }
            await unidade.update({
                status: 'ativo'
            })

            return { message: 'Unidade ativada com sucesso!', unidade }
        } catch (error) {
            console.error('Erro ao ativar unidade', error);
            throw error;
        }
    }

}