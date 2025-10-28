import Casa from "../models/Casa.js";
import CasaView from "../models/CasaView.js";

export default class CasaService {

    static async getAllHouses(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [["casa_id", "ASC"]],
            }

            const casas = await CasaView.paginate(options);
            return casas;
        } catch (error) {
            console.error('Erro ao listar casas', error);
            throw error;
        }
    }

    static async getAllHousesAtivas(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [["casa_id", "ASC"]],
                where: { casa_status: 'ativo' }
            }
            const casas = await CasaView.paginate(options);
            return casas;
        } catch (error) {
            console.error('Erro ao listar casas ativas', error);
            throw error;
        }
    }

    static async getAllHousesInativas(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [["casa_id", "ASC"]],
                where: { casa_status: 'inativo' }
            }
            const casas = await CasaView.paginate(options);
            return casas;
        } catch (error) {
            console.error('Erro ao listar casas inativas');
            throw error;
        }
    }

    static async countHouses() {
        try {
            const casas = await Casa.count();
            return casas;
        } catch (error) {
            console.error('Erro ao listar contagem de casas');
            throw error;
        }
    }

    static async countHousesAtivas() {
        try {
            const casas = await Casa.count({
                where: { status: 'ativo' }
            })
            return casas;
        } catch (error) {
            console.error('Erro ao listar contagem de casas ativas');
            throw error;
        }
    }

    static async inativarCasa(id) {
        try {
            const casa = await Casa.findByPk(id);
            if (!casa) {
                throw new Error('Casa não encontrada');
            }

            if (casa.status === 'inativo') {
                throw new Error('Casa já está inativa');
            }

            await casa.update({
                status: 'inativo'
            })
            return casa;
        } catch (error) {
            console.error('Erro ao inativar casa:', error.message);
            throw new Error(error.message);
        }
    }

    static async ativarCasa(id) {
        try {
            const casa = await Casa.findByPk(id);
            if (!casa) {
                throw new Error('Casa não encontrada');
            }

            if (casa.status === 'ativo') {
                throw new Error('Casa já está ativada');
            }

            await casa.update({
                status: 'ativo'
            })
            return { message: 'Casa ativada com sucesso', casa };
        } catch (error) {
            console.error('Erro ao ativar casa');
            throw error;
        }
    }


}