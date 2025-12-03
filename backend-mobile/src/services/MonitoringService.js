import Sensor from "../models/Sensor.js";
import LeituraSensor from "../models/LeituraSensor.js";
import Alerta from "../models/Alerta.js";
import Comunicados from "../models/Comunicados.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import sequelize from "../config/sequelize.js";

export default class MonitoringService {
    static async registrarLeitura(codigoSensor, consumo, vazamentoDetectado) {
        const transaction = await sequelize.transaction();
        try {
            const sensor = await Sensor.findOne({ where: { codigo: codigoSensor }, transaction });
            if (!sensor) throw new Error("Sensor não encontrado.");

            let casa = await Casa.findOne({ where: { sensor_id: sensor.id }, transaction });
            let apartamento = null;
            let residenciaType = 'casa';
            let residenciaId = null;

            if (casa) {
                residenciaId = casa.id;
            } else {
                apartamento = await Apartamento.findOne({ where: { sensor_id: sensor.id }, transaction });
                if (apartamento) {
                    residenciaType = 'apartamento';
                    residenciaId = apartamento.id;
                }
            }

            const leitura = await LeituraSensor.create({
                sensor_id: sensor.id,
                consumo: consumo,
                vazamento_detectado: vazamentoDetectado,
                data_registro: new Date()
            }, { transaction });

            sensor.consumo_total = parseFloat(sensor.consumo_total) + parseFloat(consumo);
            sensor.ultimo_envio = new Date();
            await sensor.save({ transaction });

            if (vazamentoDetectado) {
                await this.gerarAlertaVazamento(sensor.id, residenciaType, residenciaId, transaction);
            }

            await transaction.commit();
            return leitura;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async gerarAlertaVazamento(sensorId, type, id, transaction) {
        const alertaExistente = await Alerta.findOne({
            where: { sensor_id: sensorId, tipo: 'vazamento', resolvido: false },
            transaction
        });

        if (!alertaExistente) {
            await Alerta.create({
                sensor_id: sensorId, residencia_type: type, residencia_id: id,
                tipo: 'vazamento', mensagem: 'Vazamento detectado! Verifique suas instalações.', nivel: 'critico'
            }, { transaction });

            // CRIA A NOTIFICAÇÃO NO APP
            await Comunicados.create({
                title: '🚨 ALERTA DE VAZAMENTO',
                subject: 'O sensor detectou um fluxo anormal de água. Verifique torneiras e canos imediatamente.',
                addressee: 'usuários',
                status: 'ativo',
                casa_id: type === 'casa' ? id : null,
                condominio_id: null // Se quiser lógica pra apto, expandir aqui
            }, { transaction });
        }
    }
}