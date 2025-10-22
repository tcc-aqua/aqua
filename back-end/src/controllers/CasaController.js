import CasaService from "../services/CasaService.js";
import { z } from "zod";

const createHouseSchema = z.object({
    endereco: z.string(),
    sensor_id: z.string().email(),
})

const updateHouseSchema = z.object({
    numero_moradores: z.string().optional(),
    endereco: z.string().email().optional(),
    sensor_id: z.string().uuid()
});

export default class CasaController {

    static async getAll(req, reply) {
        const casas = await CasaService.getAllHouses();
        return reply.status(200).send(casas);
    }

    static async getAllAtivos(req, reply) {
        const casas = await CasaService.getAllHousesAtivas();
        return reply.status(200).send(casas);
    }

    static async getAllInativos(req, reply) {
        const casas = await CasaService.getAllHousesInativas();
        return reply.status(200).send(casas);
    }

    static async count(req, reply) {
        const casas = await CasaService.countHouses();
        return reply.status(200).send(casas);
    }

    static async countAtivas(req, reply) {
        const casas = await CasaService.countHousesAtivas();
        return reply.status(200).send(casas);
    }

    static async create(req, reply) {
        const validateHouse = createHouseSchema.parse(req.body);
        const casa = await CasaService.createHouse(validateHouse);
        return reply.status(201).send(casa)
    }

    static async update(req, reply) {
        const validateHouse = updateHouseSchema.parse(req.body);
        const casa = await CasaService.updateHouse(validateHouse);
        return reply.status(201).send(casa);
    }



}