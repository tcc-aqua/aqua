import Comunicados from "../../models/Comunicados.js";
import ComunicadosLidos from '../../models/ComunicadoLido.js'
import User from "../../models/User.js";
import Apartamento from "../../models/Apartamento.js";
import { Sequelize } from "sequelize";

export default class ComparacaoComunicado {
    static async getComunicadosResumo(sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) throw new Error("Síndico não encontrado");

            const condominioId = sindico.condominio_id;

            const totalComunicados = await Comunicados.count({
                include: [
                    {
                        model: Apartamento,
                        where: { condominio_id: condominioId },
                        attributes: []
                    }
                ]
            });

            const totalNaoLidos = await ComunicadosLidos.count({
                where: { lido: false },
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: Apartamento,
                                where: { condominio_id: condominioId },
                                attributes: []
                            }
                        ],
                        attributes: []
                    }
                ]
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
