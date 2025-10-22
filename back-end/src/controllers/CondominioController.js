import CondominioService from "../services/CondominioService.js";
import { z } from 'zod';

const createCondominioSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    sindico_id: z.string().uuid()
})

const updateCondominioSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    sindico_id: z.string().uuid()
});

const idSchema = z.string().uuid();
export default class CondominioController {
    static async getAll(req, reply) {
        const condominios = await CondominioService.getAllCondominios();
        return reply.status(200).send(condominios);
    }

    static async getAllActives(req, reply) {
        const condominios = await CondominioService.getAllActives();
        return reply.status(200).send(condominios);
    }

    static async getAllInativos(req, reply) {
        const condominios = await CondominioService.getAllInativos();
        return reply.status(200).send(condominios);
    }

    static async count(req, reply) {
        const condominiosTotais = await CondominioService.countAllCondominios();
        return reply.status(200).send(condominiosTotais);
    }

    static async create(req, reply) {
        const validateCondominio = createCondominioSchema.parse(req.body);
        const condominio = await CondominioService.createCondominio(validateCondominio)
        return reply.status(201).send(condominio);
    }

    static async update(req, reply) {
        const validateCondominio = updateCondominioSchema.parse(req.body);
        const updateCondominio = await CondominioService.updateCondominio(id, validateCondominio);
        return reply.status(200).send(updateCondominio)
    }

    static async inativar(req, reply) {
        const { id } = idSchema.parse(req.params);
        const condominio = await CondominioService.inativarCondominio(id);
        return reply.status(200).send(condominio);
    }
}