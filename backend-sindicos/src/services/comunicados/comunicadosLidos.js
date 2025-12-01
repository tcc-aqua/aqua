import ComunicadosLidos from "../../models/ComunicadosLidos.js";
import Comunicados from "../../models/Comunicados.js";
import Condominio from "../../models/Condominio.js";
import { Op } from "sequelize";

export default class marcarComunicadoLidoService {
    static async updateStatusLido(comunicado_id, user_id, lido) {
        try {
            const [comunicadoLido, created] = await ComunicadosLidos.upsert({
                comunicado_id,
                user_id,
                lido
            });

            return [comunicadoLido, created];

        } catch (error) {
            console.error("Erro ao marcar status do comunicado:", error);
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
                [Op.or]: [
                    { addressee: { [Op.in]: ['usuários', 'sindicos'] }, condominio_id: null },
                    { condominio_id },
                    { sindico_id: user_id }
                ],
                [Op.not]: { sindico_id: user_id }
            };

            const comunicadosVisiveis = await Comunicados.findAll({
                where: whereComunicadosVisiveis,
                attributes: ['id']
            });

            const comunicadosVisiveisIds = comunicadosVisiveis.map(c => c.id);
            const comunicadosLidosCount = await ComunicadosLidos.count({
                where: {
                    user_id: user_id,
                    lido: true,
                    comunicado_id: { [Op.in]: comunicadosVisiveisIds }
                }
            });

            const totalVisivel = comunicadosVisiveisIds.length;
            const naoLidos = totalVisivel - comunicadosLidosCount;

            return naoLidos;

        } catch (error) {
            console.error("Erro ao contar comunicados não lidos:", error);
            throw new Error("Falha ao obter a contagem de comunicados não lidos.");
        }
    }
}