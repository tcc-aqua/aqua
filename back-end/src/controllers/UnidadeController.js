import CondominioService from "../services/CondominioService.js";
import UnidadeService from "../services/UnidadeService.js";
import { z } from 'zod';

const createUnidadeSchema = z.object({
    condominio_id: z.int(),
    numero: z.int(),
    bloco: z.string(),
    sensor_id: z.int(),
})

const updateUnidadeSchema = z.object({
    condominio_id: z.int(),
    numero: z.int(),
    bloco: z.string(),
    sensor_id: z.int(),
});
export default class UnidadeController {

    static async getAll(req, reply) {
        const unidades = await UnidadeService.getAllUnidades();
        return reply.status(200).send(unidades);
    }

    static async getAllAtivos(req, reply) {
        const unidades = await UnidadeService.getAllUnidadesAtivas();
        return reply.status(200).send(unidades);
    }

    static async getAllInativos(req, reply) {
        const unidades = await UnidadeService.getAllUnidadesInativas();
        return reply.status(200).send(unidades);
    }

    static async count(req, reply) {
        const unidades = await UnidadeService.countUnidades();
        return reply.status(200).send(unidades);
    }

    static async create(req, reply) {
        const validateUnidade = createUnidadeSchema.parse(req.body);
        const unidade = await UnidadeService.createCondominio(validateUnidade);
        return reply.status(201).send(unidade);
    }

    static async update(req, reply) {
        const validateUnidade = updateUnidadeSchema.parse(req.body);
        const unidade = await UnidadeService.createUnidades(validateUnidade);
        return reply.status(200).send(unidade);
    }

    static async inativar(req, reply) {
        const {id} = req.params;
        const unidade = await UnidadeService.inativarUnidade(id);
        return reply.status(200).send(unidade);
    }

}