import Endereco from "../models/Endereco.js";

export default class EnderecoController {
    static async getAll(request, reply) {
        try {
            const enderecos = await Endereco.findAll();
            return reply.status(200).send(enderecos);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao listar endereços' })
        }
    }

    static async getByid(reply, request) {
        try {
            const { id } = request.params;
            const endereco = Endereco.findByPk(id);
            if (!endereco) {
                return reply.status(4040).send({ message: 'Endereço não encontrado' });
            }
            return reply.status(200).send(endereco);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao encontrar endereço.' })
        }
    }

    static async create(request, reply) {
        try {
            const { rua, numero, complemento, bairro, estado, cidade, cep, user_id } = request.body;
            const endereco = await Endereco.create({
                rua, numero, complemento, bairro, estado, cidade, cep, user_id
            })
            reply.status(201).send(endereco);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao criar endereço' })
        }
    }

    static async update(request, reply) {
        try {
            const { id } = request.params;
            const { rua, numero, complemento, bairro, estado, cidade, cep, user_id } = request.body;
            const endereco = await Endereco.update({
                rua, numero, complemento, bairro, estado, cidade, cep, user_id
            })

            if (!endereco) {
                return reply.status(4040).send({ message: 'Endereço não encontrado' });
            }

            await endereco.update({
                rua, numero, complemento, bairro, estado, cidade, cep, user_id
            })
            return reply.status(200).send(endereco);
        } catch (err) {
            return reply.status(500).send({ error: 'Erro ao atualizar o endereço' })
        }
    }

    static async delete(request, reply) {
        try {
            const { id } = request.params;
            const endereco = await Endereco.findByPk(id);
            if (!endereco) {
                return reply.status(4040).send({ message: 'Endereço não encontrado' });
            }
            await endereco.destroy();
            return reply.status(200).send({message: 'Endereço excluido com sucesso!!!'})

        } catch (err){
            return reply.status(500).send({ error: 'Erro ao deletar o endereço' })
        }
    }
}

