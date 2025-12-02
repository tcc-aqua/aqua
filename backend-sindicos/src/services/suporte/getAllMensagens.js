import Suporte from "../../models/Suporte.js";
import Condominio from "../../models/Condominio.js";
import { Op } from "sequelize";

export default class GetMensagensSuporteService {
    static async getAllMensagens(sindico_id, page = 1, limit = 10) {
        try {
            const condominio = await Condominio.findOne({
                where: { sindico_id },
                attributes: ['id']
            });

            const condominio_id = condominio ? condominio.id : null;

            if (!condominio_id) {
                const optionsSemCondominio = {
                    page: page,
                    paginate: limit,
                    order: [['criado_em', 'DESC']],
                    where: {
                        [Op.or]: [
                            { remetente_id: sindico_id },
                            { destinatario_id: sindico_id }
                        ]
                    }
                };
                 return await Suporte.paginate(optionsSemCondominio);
            }

            const options = {
                page: page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: {
                    [Op.or]: [
                        { remetente_id: sindico_id },
                        { destinatario_id: sindico_id },
                        { condominio_id: condominio_id },
                        { tipo_destino: 'sindico', condominio_id: condominio_id }
                    ]
                },
            };

            return await Suporte.paginate(options);

        } catch (error) {
            console.error("Erro ao listar mensagens de suporte:", error);
            throw new Error("Falha ao obter a lista de mensagens.");
        }
    }
}