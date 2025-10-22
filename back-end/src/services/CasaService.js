import Casa from "../models/Casa.js";

export default class CasaService {

    static async getAllHouses(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
            }

            const casas = await Casa.paginate(options);
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
                order: [['criado_em', 'DESC']],
                where: { status: 'ativo' }
            }
            const casas = await Casa.paginate(options);
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
                order: [['criado_em', 'DESC']],
                where: { status: 'inativo' }
            }
            const casas = await Casa.paginate(options);
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

    static async createHouse({ endereco, sensor_id }) {
        try {
            const casas = await Casa.create({
                endereco, sensor_id
            })
            return casas;
        } catch (error) {
            console.error('Erro ao criar casa', error);
            throw error;
        }
    }

    static async updateHouse(id, { numero_moradores, endereco, sensor_id }) {
        try {
            const casa = await Casa.findByPk(id);
            if (!casa) {
                throw new Error('Casa não encontrada');
            }
            await casa.update({
                numero_moradores, endereco, sensor_id
            })
            return casa;
        } catch (error) {
            console.error('Erro ao atualizar casa', error);
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
            console.error('Erro ao inativar casa');
            throw error;
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