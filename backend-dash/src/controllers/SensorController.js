import SensorService from "../services/SensorService.js";
import { z } from "zod";

const createSensorSchema = z.object({
    codigo: z.uuid(),
})


export default class SensorController {
    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sensores = await SensorService.getAll(page, limit);
        return reply.status(200).send(sensores);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sensores = await SensorService.getAllInativos(page, limit);
        return reply.status(200).send(sensores);
    }

    static async getAllAtivos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sensores = await SensorService.getAllAtivos(page, limit);
        return reply.status(200).send(sensores);
    }

    static async getConsumoTotalDosSensores(req, reply) {
        const sensor = await SensorService.consumoTotalSensores();
        return reply.status(200).send(sensor);
    }

    static async count(req, reply) {
        const sensores = await SensorService.countSensores();
        return reply.status(200).send(sensores);
    }

    static async countAtivos(req, reply) {
        const sensores = await SensorService.countSensoresAtivos();
        return reply.status(200).send(sensores);
    }

    static async create(req, reply) {
        const validateSensor = createSensorSchema.parse(req.body);
        const sensor = await SensorService.createSensor(validateSensor);
        return reply.status(201).send(sensor);
    }

    static async inativar(req, reply) {
        const { id } = req.params;
        const sensor = await SensorService.inativarSensor(id);
        return reply.status(200).send(sensor);
    }

    static async ativar(req, reply) {
        const { id } = req.params;
        const sensor = await SensorService.ativarSensor(id);
        return reply.status(200).send(sensor);
    }

}