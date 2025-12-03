import Casa from "../models/Casa.js";
import CasaView from "../models/CasaView.js";
import AuditLogService from "./AuditLog.js";

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

  static async inativarCasa(casaId, adminId) {
    try {
        const casa = await Casa.findByPk(casaId);
        if (!casa) throw new Error('Casa não encontrada');
        if (casa.status === 'inativo') throw new Error('Casa já está inativa');

        const valorAntigo = casa.status;

        await casa.update({ status: 'inativo' });

        
        await AuditLogService.criarLog({
            user_id: casaId,    
            acao: 'update',
            campo: 'status',
            valor_antigo: valorAntigo,
            valor_novo: 'inativo',
            alterado_por: adminId 
        });

        return { message: 'Casa inativada com sucesso!', casa };
    } catch (error) {
        console.error('Erro ao inativar casa:', error);
        throw error;
    }
}

static async ativarCasa(casaId, adminId) {
    try {
        const casa = await Casa.findByPk(casaId);
        if (!casa) throw new Error('Casa não encontrada');
        if (casa.status === 'ativo') throw new Error('Casa já está ativada');

        const valorAntigo = casa.status;

        await casa.update({ status: 'ativo' });

        // Criando log
        await  AuditLogService.criarLog({
            user_id: casaId,
            acao: 'update',
            campo: 'status',
            valor_antigo: valorAntigo,
            valor_novo: 'ativo',
            alterado_por: adminId
        });

        return { message: 'Casa ativada com sucesso!', casa };
    } catch (error) {
        console.error('Erro ao ativar casa:', error);
        throw error;
    }
}



}