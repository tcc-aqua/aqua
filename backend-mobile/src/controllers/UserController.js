import User from "../models/User.js";

export default class UserController {
    static async getAll(request, reply) {
        try {
            const users = await User.findAll();
            return reply.status(200).send(users);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to fetch all users' });
        }
    }

    static async getUserByid(request, reply) {
        try {
            const { id } = request.params;
            const user = await User.findByPk(id);
            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }
            return reply.status(200).send(user);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to fetch user' });
        }
    }

    static async create(request, reply) {
        try {
            const { nome, senha, email, cpf, role } = request.body;
            const user = await User.create({
                nome, senha, email, cpf, role
            });
            return reply.status(201).send(user);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to create user' });
        }
    }

    static async update(request, reply) {
        try {
            const { id } = request.params;
            const { nome, senha, email, cpf, role } = request.body;
            const user = await User.findByPk(id);
            if (!user) {
                return reply.status(200).send({ message: 'User not found' });
            }
            await user.update({
                nome, senha, email, cpf, role
            })
            return reply.status(200).send(user);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to update user' });
        }
    }

    static async delete(request, reply){
        try {
            const { id } = request.params;
            const user = await User.findByPk(id);
            if(!user){
                return reply.status(404).send({message: 'User not found'})
            }
            await user.destroy();
            return reply.status(200).send({message: 'Deleted successfully'});
        } catch (error) {
            return reply.status(500).send({error: 'Failed to delete user'})
        }
    }
}