import { createComunicado } from "../dto/comunicados/createComunicadoDTO.js";
import { updateComunicado } from "../dto/comunicados/updateComunicadoDTO.js";
import ComunicadosService from "../services/ComunicadosService.js";

export default class ComunicadosController {
    static async getAll(req, reply){
        const comunicados = await ComunicadosService.getAll();
        return reply.status(200).send(comunicados);
    }

    static async create(req, reply) {
        const validateComunicado = createComunicado.parse(req.body);
        const comunicado = await ComunicadosService.create(validateComunicado);
        return reply.status(201).send(comunicado);
    }

    static async update(req, reply){
        const { id } = req.params;
        const validateComunicado = updateComunicado.parse(req.body);
        const comunicado = await ComunicadosService.update(id, validateComunicado);
        return reply.status(200).send(comunicado);
    }

    static async delete(req, reply){
        const {id} = req.params;
        const comunicado = await ComunicadosService.deleteComunicado(id);
        return reply.status(200).send(comunicado);
    }
}