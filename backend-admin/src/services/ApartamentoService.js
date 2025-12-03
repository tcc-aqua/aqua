import Apartamento from "../models/Apartamento.js";
import ApartamentoView from "../models/ApartamentoView.js";
import AuditLogService from './AuditLog.js';

export default class ApartamentoService {

    static async getAllApartamentos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['apartamento_id', 'DESC']]
            }
            const apartamentos = await ApartamentoView.paginate(options);
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
                order: [['apartamento_id', 'DESC']],
                where: { apartamento_status: 'ativo' }
            }
            const apartamentos = await ApartamentoView.paginate(options);
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
                order: [['apartamento_id', 'DESC']],
                where: { apartamento_status: 'inativo' }
            }
            const apartamentos = await ApartamentoView.paginate(options);
            return apartamentos;
        } catch (error) {
            console.error('Erro ao listar todas as apartamentos inativas');
            throw error;
        }
    }

    static async countApartamentos() {
        try {
            const apartamentos = await Apartamento.count();
            return apartamentos;
        } catch (error) {
            console.error('Erro ao contar apartamentos', error);
            throw error;
        }
    }

    static async inativarApartamento(apartamentoId, adminId) {
        try {
            const apartamento = await Apartamento.findByPk(apartamentoId);
            if (!apartamento) {
                throw new Error('Apartamento não encontrado.');
            }

            const valorAntigo = apartamento.status;

            await apartamento.update({ status: 'inativo' });


            await AuditLogService.criarLog({
                user_id: apartamentoId,
                acao: 'update',
                campo: 'status',
                valor_antigo: valorAntigo,
                valor_novo: 'inativo',
                alterado_por: adminId
            });

            return { message: 'Apartamento inativado com sucesso!', apartamento };
        } catch (error) {
            console.error('Erro ao inativar apartamento', error);
            throw error;
        }
    }

    static async ativarApartamento(apartamentoId, adminId) {
        try {
            const apartamento = await Apartamento.findByPk(apartamentoId);
            if (!apartamento) {
                throw new Error('Apartamento não encontrado.');
            }

            const valorAntigo = apartamento.status;

            await apartamento.update({ status: 'ativo' });


            await AuditLogService.criarLog({
                user_id: apartamentoId,
                acao: 'update',
                campo: 'status',
                valor_antigo: valorAntigo,
                valor_novo: 'ativo',
                alterado_por: adminId
            });

            return { message: 'Apartamento ativado com sucesso!', apartamento };
        } catch (error) {
            console.error('Erro ao ativar apartamento', error);
            throw error;
        }
    }


}