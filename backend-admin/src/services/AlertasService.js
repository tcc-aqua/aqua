import { fn, col, Op } from "sequelize";
import Alertas from "../models/Alertas.js";
import Condominio from "../models/Condominio.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";

export default class AlertasService {

    static async getAlertasRecentes() {
        try {
            const alertas = await Alertas.findAll({
                limit: 5, // pega apenas 5
                order: [['criado_em', 'DESC']]
            });
            return alertas;
        } catch (error) {
            console.error('Erro ao listar alertas recentes', error);
            throw error;
        }
    }

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
            return { totalAlertasAtivos: alertas };
        } catch (error) {
            console.error('Erro ao fazer contagem de alertas ativos', error);
            throw error;
        }
    }

    static async countTotalCasa() {
        try {
            const total = await Alertas.count({
                where: {
                    casa_id: { [Op.ne]: null },
                    resolvido: false // apenas alertas ativos
                }
            });

            return { totalAlertasCasa: total };
        } catch (error) {
            console.error('Erro ao contar alertas gerais de casas:', error);
            throw error;
        }
    }

    static async countAlertasDeVazamento() {
        try {
            const total = await Alertas.count({
                where: {
                    tipo: 'vazamento'
                }
            });

            return total;
        } catch (error) {
            console.error('Erro ao contar alertas gerais de vazamento:', error);
            throw error;
        }
    }

    static async countAlertasDeConsumoAlto() {
        try {
            const total = await Alertas.count({
                where: {
                    tipo: 'consumo_alto'
                }
            });

            return total;
        } catch (error) {
            console.error('Erro ao contar alertas gerais de consumo alto:', error);
            throw error;
        }
    }

    static async countTotalApartamento() {
        try {
            const total = await Alertas.count({
                where: {
                    condominio_id: { [Op.ne]: null },
                    resolvido: false
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
                    condominio_id: { [Op.ne]: null },
                    resolvido: false // apenas ativos
                },
                group: ['condominio_id', 'condominio.id', 'condominio.nome'],
                order: [[fn('COUNT', col('id')), 'DESC']]
            });

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

    // alertas por cada casa
    static async countAlertasAtivosPorCasa() {
        try {
            const alertas = await Alertas.findAll({
                attributes: [
                    'residencia_id',
                    [fn('COUNT', col('Alertas.id')), 'total_alertas']
                ],
                where: {
                    resolvido: false,
                    residencia_type: 'casa'
                },
                group: ['residencia_id'],
                include: [
                    {
                        model: Casa,
                        as: 'casa',
                        attributes: ['logradouro', 'numero', 'bairro', 'cidade', 'uf']
                    }
                ],
                order: [[fn('COUNT', col('Alertas.id')), 'DESC']]
            });

            return alertas.map((a, index) => ({
                id: index + 1,
                residencia_id: a.residencia_id,
                identificacao: a.casa
                    ? `${a.casa.logradouro}, Nº ${a.casa.numero} - ${a.casa.bairro}, ${a.casa.cidade} - ${a.casa.uf}`
                    : 'Desconhecido',
                total_alertas: Number(a.getDataValue('total_alertas'))
            }));
        } catch (error) {
            console.error("Erro ao contar alertas ativos por casa", error);
            throw error;
        }
    }

    static async countAlertasAtivosPorApartamento() {
        try {
            const alertas = await Alertas.findAll({
                attributes: [
                    'residencia_id',
                    [fn('COUNT', col('Alertas.id')), 'total_alertas']
                ],
                where: {
                    resolvido: false,
                    residencia_type: 'apartamento'
                },
                group: ['residencia_id'],
                include: [
                    {
                        model: Apartamento,
                        as: 'apartamento',
                        attributes: ['numero', 'bloco']
                    }
                ],
                order: [[fn('COUNT', col('Alertas.id')), 'DESC']]
            });

            return alertas.map((a, index) => ({
                id: index + 1,
                residencia_id: a.residencia_id,
                identificacao: a.apartamento
                    ? `Bloco ${a.apartamento.bloco || '-'}, Nº ${a.apartamento.numero}`
                    : 'Desconhecido',
                total_alertas: Number(a.getDataValue('total_alertas'))
            }));
        }
        catch (error) {
            console.error('Erro ao listar count', error);
            throw error;
        }
    }

    static async createAlerta({ sensor_id, residencia_type, residencia_id, tipo, mensagem, nivel }) {
        try {
            const alerta = await Alertas.create({ sensor_id, residencia_type, residencia_id, tipo, mensagem, nivel })
            return alerta;
        } catch (error) {
            console.error('Erro ao emitir alerta', error);
            throw error;
        }
    }

    static async removerAlerta(id) {
        try {
            const alerta = await Alertas.findByPk(id);
            if (!alerta) {
                throw new Error("Alerta não encontrado")
            }

            await alerta.update({ resolvido: true });

            return { message: 'Alerta resolvido com sucesso!', alerta };
        } catch (error) {
            console.error('Erro ao atualizar status do alerta', error);
            throw error;
        }
    }
}
