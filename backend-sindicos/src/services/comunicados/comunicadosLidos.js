import ComunicadosLidos from "../../models/ComunicadoLido.js";
import Comunicados from "../../models/Comunicados.js";
import Condominio from "../../models/Condominio.js";
import { Op } from "sequelize";

export default class marcarComunicadoLidoService {
    static async updateStatusLido(comunicado_id, user_id, lido) {
        try {
            const [comunicadoLido] = await ComunicadosLidos.upsert({ 
                comunicado_id,
                user_id,
                lido
            }, { returning: true }); 
            return comunicadoLido; 

        } catch (error) {
            console.error("Erro ao marcar status do comunicado (Detalhes do BD):", error);
            throw new Error("Falha ao atualizar o status de leitura do comunicado."); 
        }
    }

    static async countNaoLidos(user_id) {
        try {
            const condominio = await Condominio.findOne({
                where: { sindico_id: user_id },
                attributes: ['id']
            });

            const condominio_id = condominio ? condominio.id : null;

            const whereComunicadosVisiveis = {
                // EXCLUSÃO: O síndico não pode ter criado o comunicado
                sindico_id: { [Op.ne]: user_id }, 
                
                [Op.or]: [
                    // A) Comunicados GLOBAIS destinados a SÍNDICOS (Condomínio ID é nulo)
                    { 
                        addressee: 'sindicos', 
                        condominio_id: null 
                    },
                    
                    // B) TODOS os comunicados associados ao SEU Condomínio ID, de qualquer destinatário
                    ...(condominio_id ? [{ condominio_id }] : []),
                ]
            };
            
            // Caso o síndico não esteja associado a um condomínio, remove o filtro B
            if (!condominio_id) {
                 whereComunicadosVisiveis[Op.or] = [
                    { 
                        addressee: 'sindicos', 
                        condominio_id: null 
                    }
                 ];
            }

            const comunicadosVisiveis = await Comunicados.findAll({
                where: whereComunicadosVisiveis,
                attributes: ['id']
            });

            const comunicadosVisiveisIds = comunicadosVisiveis.map(c => c.id);
            const totalVisivel = comunicadosVisiveisIds.length;
            if (totalVisivel === 0) return 0;
            const comunicadosLidosCount = await ComunicadosLidos.count({
                where: {
                    user_id: user_id,
                    lido: true,
                    comunicado_id: { [Op.in]: comunicadosVisiveisIds }
                }
            });

            const naoLidos = totalVisivel - comunicadosLidosCount;

            return naoLidos;

        } catch (error) {
            console.error("Erro ao contar comunicados não lidos:", error);
            throw error; 
        }
    }
}