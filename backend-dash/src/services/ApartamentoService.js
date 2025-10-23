import Apartamento from "../models/Apartamento.js";

export default class ApartamentoService {

    static async getAllApartamentos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
            }
            const apartamentos = await Apartamento.paginate(options);
            return apartamentos;
        } catch (error) {
            console.error("Erro ao listr todas as apartamentos", error);
            throw error;
        }
    }

    static async getAllApartamentosAtivos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { status: 'ativo' }
            }
            const apartamentos = await Apartamento.paginate(options);
            return apartamentos;
        } catch (error) {
            console.error('Erro ao listar todas as apartamentos ativas');
            throw error;
        }
    }

    static async getAllApartamentosInativos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { status: 'inativo' }
            }
            const apartamentos = await Apartamento.paginate(options);
            return apartamentos;
        } catch (error) {
            console.error('Erro ao listar todas as apartamentos inativas');
            throw error;
        }
    }

    static async inativarApartamento(id) {
        try {
            const apartamento = await Apartamento.findByPk(id);
            if (!apartamento) {
                throw new Error('Apartamento não encontrada.')
            }
            await apartamento.update({
                status: 'inativo'
            })

            return { message: 'Apartamento inativada com sucesso!', apartamento }
        } catch (error) {
            console.error('Erro ao inativar apartamento', error);
            throw error;
        }
    }

    static async ativarApartamento(id) {
        try {
            const apartamento = await Apartamento.findByPk(id);
            if (!apartamento) {
                throw new Error('Apartamento não encontrada.')
            }
            await apartamento.update({
                status: 'ativo'
            })

            return { message: 'Apartamento ativada com sucesso!', apartamento }
        } catch (error) {
            console.error('Erro ao ativar apartamento', error);
            throw error;
        }
    }

}