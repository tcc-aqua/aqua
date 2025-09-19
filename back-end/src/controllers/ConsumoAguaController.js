import ConsumoAgua from "../models/ConsumoAgua.js";

export default class ConsumoAguaController {
    static async getAll(request, reply) {
        try {
            const consumos = await ConsumoAgua.findAll();
            return reply.status(200).send(consumos);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao listar os consumos de água' })
        }
    }

    static async getById(request, reply) {
        try {
            const { id } = request.params;
            const consumo = await ConsumoAgua.findByPk(id);
            if (!consumo) {
                return reply.status(404).send({ error: 'Consumo não encontrado' })
            }
            return reply.status(200).send(consumo);
        } catch (err) {
            return reply.status(500).send({ error: "Erro ao listar o consumo" });
        }
    }

    static async create(request, reply) {
        try {
            const { litros, data_hota, user_id } = request.body;
            const consumo = await ConsumoAgua.create({
                litros, data_hota, user_id
            })
            return reply.status(201).send(consumo);
        } catch (error){
            return reply.status(500).send({error: 'Erro ao criar consumo'})
        }
    }

} 