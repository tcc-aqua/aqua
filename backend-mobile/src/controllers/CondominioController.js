import CondominioService from "../services/CondominioService.js";
import { registerCondominioSchema } from "../dtos/condominio/condominioDTO.js";

export default class CondominioController {
    static async create(req, reply) {
        try {
            const data = registerCondominioSchema.parse(req.body);
            const result = await CondominioService.create(data);
            return reply.status(201).send(result);
        } catch (error) {
            if (error?.issues) {
                return reply.status(400).send({ errors: error.issues });
            }
            return reply.status(400).send({ error: error.message });
        }
    }

    static async getAll(req, reply) {
        try {
            const condominios = await CondominioService.getAll();
            return reply.status(200).send(condominios);
        } catch (error) {
            return reply.status(500).send({ error: error.message });
        }
    }
}