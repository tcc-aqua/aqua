import Apartamento from "../models/Apartamento.js";
import LeituraSensor from "../models/LeituraSensor.js";
import { Op } from "sequelize";

export default class ApartamentoService {

    static async getConsumoTotal(apartamentoId) {
        try {
            const apartamento = await Apartamento.findByPk(apartamentoId);

            if (!apartamento) {
                throw new Error('Apartamento não encontrado');
            }
            if (!apartamento.sensor_id) {
                throw new Error('Apartamento não possui um sensor associado.');
            }

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const ontemInicio = new Date(hoje);
            ontemInicio.setDate(ontemInicio.getDate() - 1);
            
            const ontemFim = new Date(hoje);

            const consumoTotal = await LeituraSensor.sum('consumo', {
                where: { sensor_id: apartamento.sensor_id }
            });

            const consumoHoje = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: apartamento.sensor_id,
                    data_registro: { [Op.gte]: hoje }
                }
            });

            const consumoOntem = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: apartamento.sensor_id,
                    data_registro: { 
                        [Op.gte]: ontemInicio,
                        [Op.lt]: ontemFim
                    }
                }
            });

            const valHoje = consumoHoje || 0;
            const valOntem = consumoOntem || 0;
            let comparacao = 0;

            if (valOntem > 0) {
                comparacao = ((valHoje - valOntem) / valOntem) * 100;
            } else if (valHoje > 0) {
                comparacao = 100;
            }

            return { 
                consumoTotal: parseFloat((consumoTotal || 0).toFixed(2)),
                consumoHoje: parseFloat(valHoje.toFixed(2)),
                consumoOntem: parseFloat(valOntem.toFixed(2)),
                comparacaoPorcentagem: parseFloat(comparacao.toFixed(1))
            };

        } catch (error) {
            console.error('Erro ao listar dados de consumo do apartamento', error);
            throw error;
        }
    }
}