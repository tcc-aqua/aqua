import { where } from "sequelize";
import Alertas from "../models/Alertas.js";
import Condominio from "../models/Condominio.js";

export default class AlertasService {

    static async getAllAlertas(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
            }
            const alertas = await Alertas.paginate(options);
            return alertas;
        } catch (error) {
            console.error('Erro ao listar alertas', error);
            throw error;
        }
    }

    static async getAllAlertasAtivos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { resolvido: false }
            }
            const alertas = await Alertas.paginate(options);
            return alertas;
        } catch (error) {
            console.error('Erro ao listar alertas ativos', error);
            throw error;
        }
    }

    static async getAllAlertasResolvidos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { resolvido: true }
            }
            const alertas = await Alertas.paginate(options);
            return alertas;
        } catch (error) {
            console.error('Erro ao listar alertas resolvidos', error);
            throw error;
        }
    }

    static async countAlertasAtivos() {
        try {
            const alertas = await Alertas.count({
                where: { resolvido: false }
            });
            return alertas;
        } catch (error) {
            console.error('Erro ao fazer contagem de alertas', error);
            throw error;
        }
    }

     static async countTotalCasa() {
        try {
            const total = await Alertas.count({
                where: {
                    casa_id: {
                        [Op.ne]: null // exclui alertas que não pertencem a casa
                    }
                }
            });

            return { totalAlertasCasa: total };
        } catch (error) {
            console.error('Erro ao contar alertas gerais de casas:', error);
            throw error;
        }
    }

     static async countTotalCondominios() {
        try {
            const total = await Alertas.count({
                where: {
                    condominio_id: {
                        [Op.ne]: null // exclui alertas que não pertencem a condomínio
                    }
                }
            });

            return { totalAlertasCondominios: total };
        } catch (error) {
            console.error('Erro ao contar alertas gerais de condomínios:', error);
            throw error;
        }
    }

    static async countPorCondominio() {
        try {
            const resultados = await Alertas.findAll({
                attributes: [
                    'condominio_id',
                    [fn('COUNT', col('id')), 'totalAlertas']
                ],
                include: [
                    {
                        model: Condominio,
                        as: 'condominio',
                        attributes: ['id', 'nome']
                    }
                ],
                where: {
                    condominio_id: {
                        [Op.ne]: null
                    }
                },
                group: ['condominio_id', 'condominio.id', 'condominio.nome'],
                order: [[fn('COUNT', col('id')), 'DESC']]
            });

            // Mapeia o resultado
            const condominios = resultados.map(r => ({
                condominioId: r.condominio_id,
                nome: r.condominio?.nome || 'Desconhecido',
                totalAlertas: Number(r.dataValues.totalAlertas)
            }));

            return { condominios };
        } catch (error) {
            console.error('Erro ao contar alertas por condomínio:', error);
            throw error;
        }
    }


}