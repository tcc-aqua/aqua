// services/suporte/SuporteService.js

import Suporte from "../../models/Suporte.js";
import { Op } from "sequelize";

export default class SuporteService {

    /**
     * 1. Contagem de Mensagens Recebidas
     * Filtra por destinatario_id = userId OU tipo_destino = 'sindico', e sempre pelo condominioId.
     */
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

    /**
     * 2. Contagem de Mensagens Enviadas
     * Filtra por remetente_id = userId.
     */
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

    /**
     * 3. Contagem Total de Interações
     * Combina os filtros de envio e recebimento, garantindo que o síndico esteja envolvido.
     */
    static async getTotalInteracoesCount(userId, condominioId) {
        try {
            return Suporte.count({
                where: {
                    condominio_id: condominioId,
                    [Op.or]: [
                        { remetente_id: userId }, // Enviadas
                        { destinatario_id: userId }, // Recebidas explicitamente
                        { tipo_destino: 'sindico' } // Recebidas implicitamente
                    ]
                }
            });
        } catch (error) {
            console.error("Erro no Service ao contar total de interações:", error);
            throw new Error("Falha ao obter a contagem total de interações.");
        }
    }

    /**
     * 4. Contagem de Mensagens do Administrativo
     * Filtra pelo tipo 'administrativo' e pelo condomínio do síndico.
     */
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