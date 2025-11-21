import { createComunicado } from "../dto/comunicados/createComunicadoDTO.js";
import { updateComunicado } from "../dto/comunicados/updateComunicadoDTO.js";
import ComunicadosService from "../services/ComunicadosService.js";

export default class ComunicadosController {
    static async getAll(req, reply) {
        const comunicados = await ComunicadosService.getAll();
        return reply.status(200).send(comunicados);
    }

    static async create(req, reply) {
        const validateComunicado = createComunicado.parse(req.body);
        const comunicado = await ComunicadosService.create(validateComunicado);
        return reply.status(201).send(comunicado);
    }

    static async update(req, reply) {
        const { id } = req.params;
        const validateComunicado = updateComunicado.parse(req.body);
        const comunicado = await ComunicadosService.update(id, validateComunicado);
        return reply.status(200).send(comunicado);
    }

    static async delete(req, reply) {
        const { id } = req.params;
        const comunicado = await ComunicadosService.deleteComunicado(id);
        return reply.status(200).send(comunicado);
    }

    static async marcarComoLido(req, reply) {
        const user_id = req.user.id;
        const { comunicado_id } = req.body;

        if (!comunicado_id) {
            return reply.status(400).send({ error: "comunicado_id é obrigatório" });
        }

        const registro = await ComunicadosService.marcarComoLido(user_id, comunicado_id);
        return reply.status(200).send(registro);
    }

    static async getNaoLidos(req, reply) {
        const user_id = req.user.id;
        const comunicados = await ComunicadosService.getNaoLidos(user_id);
        return reply.status(200).send(comunicados);
    }
}