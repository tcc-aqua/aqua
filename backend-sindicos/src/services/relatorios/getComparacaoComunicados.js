import Comunicados from "../../models/Comunicados.js";
import ComunicadosLidos from '../../models/ComunicadoLido.js';
import User from "../../models/User.js";
import Casa from "../../models/Casa.js";
import Apartamento from "../../models/Apartamento.js";

export default class ComparacaoComunicado {
    static async getComunicadosResumo(sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) throw new Error("Síndico não encontrado");

            // pegar condominio_id a partir da residência
            let condominioId;
            if (sindico.residencia_type === 'casa') {
                const casa = await Casa.findByPk(sindico.residencia_id);
                condominioId = casa ? casa.condominio_id : null;
            } else if (sindico.residencia_type === 'apartamento') {
                const apartamento = await Apartamento.findByPk(sindico.residencia_id);
                condominioId = apartamento ? apartamento.condominio_id : null;
            }

            if (!condominioId) return { totalComunicados: 0, totalNaoLidos: 0 };

            // total de comunicados do condomínio
            const totalComunicados = await Comunicados.count({
                where: { condominio_id: condominioId }
            });

            // total de comunicados não lidos
            const usuariosDoCondominio = await User.findAll({
                where: { residencia_id: sindico.residencia_id },
                attributes: ['id']
            });
            const userIds = usuariosDoCondominio.map(u => u.id);

            const totalNaoLidos = await ComunicadosLidos.count({
                where: {
                    lido: false,
                    user_id: userIds
                }
            });

            return {
                totalComunicados,
                totalNaoLidos
            };

        } catch (error) {
            console.error("Erro ao buscar resumo de comunicados:", error);
            throw error;
        }
    }
}
