import Suporte from "../../models/Suporte.js"; 
import { Op } from "sequelize";

export default class SuporteService {

    static async getMensagensRecebidasCount(userId, condominioId) {
        try {
            return Suporte.count({
                where: {
                    condominio_id: condominioId,
                    [Op.or]: [
                        { destinatario_id: userId },
                        { tipo_destino: 'sindico' }
                    ]
                }
            });
        } catch (error) {
            console.error("Erro no Service ao contar mensagens recebidas:", error);
            throw new Error("Falha ao obter a contagem de mensagens recebidas.");
        }
    }
    static async getMensagensEnviadasCount(userId) {
        try {
            return Suporte.count({
                where: {
                    remetente_id: userId
                }
            });
        } catch (error) {
            console.error("Erro no Service ao contar mensagens enviadas:", error);
            throw new Error("Falha ao obter a contagem de mensagens enviadas.");
        }
    }

    static async getTotalInteracoesCount(userId, condominioId) {
        try {
            return Suporte.count({
                where: {
                    condominio_id: condominioId,
                    [Op.or]: [
                        { remetente_id: userId },
                        { destinatario_id: userId },
                        { tipo_destino: 'sindico' }
                    ]
                }
            });
        } catch (error) {
            console.error("Erro no Service ao contar total de interações:", error);
            throw new Error("Falha ao obter a contagem total de interações.");
        }
    }

    static async getMensagensAdministrativoCount(condominioId) {
        try {
            return Suporte.count({
                where: {
                    condominio_id: condominioId, 
                    tipo_destino: 'administrativo'
                }
            });
        } catch (error) {
            console.error("Erro no Service ao contar mensagens do administrativo:", error);
            throw new Error("Falha ao obter a contagem de mensagens do administrativo.");
        }
    }
}