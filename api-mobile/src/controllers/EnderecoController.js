import Endereco from "../models/Endereco.js";

export default class EnderecoController {
    static async getAll(request, reply) {
        try {
            const enderecos = await Endereco.findAll();
            return reply.status(200).send(enderecos);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to fetch all address' });
        }
    }

    static async getById(request, reply) {
        try {
            const { id } = request.params;
            const endereco = await Endereco.findByPk(id);
            if (!endereco) {
                return reply.status(404).send({ message: 'Address not found' });
            }
            return reply.status(200).send(endereco);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to fetch address' })
        }
    }

    static async create(request, reply) {
        try {
            const { rua, numero, complemento, bairro, estado, cidade, cep, user_id } = request.body;
            const endereco = await User.create({
                rua, numero, complemento, bairro, estado, cidade, cep, user_id
            })
            return reply.status(201).send(endereco);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to register address' })
        }
    }

    static async update(request, reply) {
        try {
            const { id } = request.params;
            const { rua, numero, complemento, bairro, estado, cidade, cep, user_id } = request.body;
            const endereco = await Endereco.findByPk(id);
            if (!endereco) {
                return reply.status(404).send({ message: 'Address not found' });
            }
            await endereco.update({
                rua, numero, complemento, bairro, estado, cidade, cep, user_id
            });
            return reply.status(200).send(endereco);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to update adress', error })
        }
    }

    static async delete(request, reply) {
        try {
            const { id } = request.params;
            const endereco = await Endereco.findByPk(id);
            if (!endereco) {
                return reply.status(404).send({ message: 'Address not found' });
            }
            await endereco.destroy();
            return reply.status(200).send({message: 'Deleted successfully'});
        } catch (error ){
            return reply.status(500).send({error: 'Failed to delete address', error})
        }
    }
}