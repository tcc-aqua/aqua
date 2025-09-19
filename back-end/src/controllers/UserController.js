import User from "../models/User.js";

export default class UserController {

    static async getAll(request, reply) {
        try {
            const users = await User.findAll();
            return reply.status(200).send(users);
        } catch (error) {
            return reply.status(500).send({ error: "Erro ao listar usuários" });
        }
    }

    static async getByid(request, reply) {
        try {
            const { id } = request.params;
            const user = await User.findByPk(id);
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' });
            }
            return reply.status(200).send(user);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao encontrar usuário' });
        }
    }

    static async create(request, reply) {
        try {
            const { nome, email, senha, role, cpf } = request.body;
            const user = await User.create({
                nome, email, senha, role, cpf
            })

            return reply.status(201).send(user);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao criar usuário' });
        }
    }

    static async update(request, body) {
        try {
            const { id } = request.params;
            const { nome, email, senha, role, cpf } = request.body;
            const user = await User.findByPk(id);
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' });
            }
            await user.update({
                nome, email, senha, role, cpf
            })
            return reply.status(200).send(user);
        } catch (error) {
            return reply.status(500).send({ error: 'Erro ao atualizar usuário' });
        }
    }

    static async delete(request, reply) {
        try {
            const { id } = request.params;
            const user = await User.findByPk(id);

            if (!user) {
                return reply.status(404).send({ message: "User not found." });
            }

            await user.destroy();
            return reply.status(200).send({ message: "User deleted with sucess!!!" })
        } catch (err) {
            request.log.error(err);
            return reply.status(500).send({ message: "Error deleted user." })
        }
    }
}