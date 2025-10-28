import Sensor from "../models/Sensor.js";
import { Op } from 'sequelize';


export default class SensorService {

    static async getAll(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
            }
            const sensores = await Sensor.paginate(options);
            return sensores;
        } catch (error) {
            console.error('Erro ao listar sensores', error);
            throw error;
        }
    }

    static async getAllAtivos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { status: 'ativo' }
            }
            const sensores = await Sensor.paginate(options);
            return sensores;
        } catch (error) {
            console.error('Erro ao listar sensores ativos', error);
            throw error;
        }
    }

    static async getAllInativos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: { status: 'inativo' }
            }
            const sensores = await Sensor.paginate(options);
            return sensores;
        } catch (error) {
            console.error('Erro ao listar sensores inativos', error);
            throw error;
        }
    }

    static async countSensores() {
        try {
            const sensores = await Sensor.count();
            return sensores;
        } catch (error) {
            console.error('Erro ao listar contagem de sensores', error);
            throw error;
        }
    }

    static async countSensoresAtivos() {
        try {
            const sensores = await Sensor.count({
                where: { status: 'ativo' }
            })
            return sensores;
        } catch (error) {
            console.error('Erro ao listar sensores ativos', error);
            throw error;
        }
    }

    static async countSensoresPorCasa() {
        try {
            const total = await Sensor.count({
                where: {
                    casa_id: {
                        [Op.ne]: null, // exclui Sensores que não pertencem a casa

                    },
                    status: 'ativo'
                }
            });

            return { totalSensoresCasa: total };
        } catch (error) {
            console.error('Erro ao contar sensores gerais de casas:', error);
            throw error;
        }
    }

    static async countSensoresPorApartamento() {
        try {
            const total = await Sensor.count({
                where: {
                    apartamento_id: {
                        [Op.ne]: null,

                    },
                    status: 'ativo'
                }
            });

            return { totalSensoresApartamento: total };
        } catch (error) {
            console.error('Erro ao contar sensores gerais de apartamento:', error);
            throw error;
        }
    }

    static async consumoTotalSensores() {
        try {
            const total = await Sensor.sum('consumo_total');
            return total;
        } catch (error) {
            console.error('Erro ao calcular consumo total dos sensores', error);
            throw error;
        }
    }

    static async consumoTotalSensoresCasas() {
        try {
            const total = await Sensor.sum('consumo_total', {
                where: {
                    casa_id: { [Op.ne]: null } // somente sensores de casas
                }
            });
            return total;
        } catch (error) {
            console.error('Erro ao calcular consumo total dos sensores de casas', error);
            throw error;
        }
    }

    static async consumoTotalSensoresApartamento() {
        try {
            const total = await Sensor.sum('consumo_total', {
                where: {
                    apartamento_id: { [Op.ne]: null } 
                }
            });
            return total;
        } catch (error) {
            console.error('Erro ao calcular consumo total dos sensores de apartamentos', error);
            throw error;
        }
    }

    static async updatesensor(id, { codigo }) {
        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor) {
                throw new Error('Sensor não encontrado');
            }

            await sensor.update({
                codigo
            })
            return sensor;
        } catch (error) {
            console.error('Erro ao atualizar sensor', error);
            throw error;
        }
    }

    static async inativarSensor(id) {
        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor) {
                throw new Error('Sensor não encontrado');
            }

            await sensor.update({
                status: 'inativo'
            })
            return sensor;
        } catch (error) {
            console.error('Erro ao inativar sensor', error);
            throw error;
        }
    }

    static async ativarSensor(id) {
        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor) {
                throw new Error('Sensor não encontrado');
            }

            await sensor.update({
                status: 'ativo'
            })
            return sensor;
        } catch (error) {
            console.error('Erro ao ativar sensor', error);
            throw error;
        }
    }


}