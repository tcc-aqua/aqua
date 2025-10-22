import { where } from "sequelize";
import Sensor from "../models/Sensor.js";

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

    static async createSensor({ codigo }) {
        try {
            const sensor = await Sensor.create({
                codigo
            })
            return sensor;
        } catch (error) {
            console.error('Erro ao criar sensor', error);
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