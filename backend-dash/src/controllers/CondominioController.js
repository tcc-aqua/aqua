import CondominioService from "../services/CondominioService.js";
import { z } from "zod";

export const createCondominioSchema = z.object({
    name: z.string(),
    numero: z.string(),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
    sindico_id: z.string().uuid()
});


const updateCondominioSchema = z.object({
    name: z.string().optional(),
    numero: z.string().optional(),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido").optional(),
    sindico_id: z.string().uuid().optional()
});

export default class CondominioController {
    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condominios = await CondominioService.getAllCondominios(page, limit);
        return reply.status(200).send(condominios);
    }

    static async getAllActives(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condominios = await CondominioService.getAllActives(page, limit);
        return reply.status(200).send(condominios);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condominios = await CondominioService.getAllInativos(page, limit);
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
        const { id } = req.params;
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