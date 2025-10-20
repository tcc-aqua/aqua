import UserService from "../services/UserService.js";
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string().length(14),
    password: z.string().min(6),
    role: z.enum(['morador', 'sindico']).optional(),
})

const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    cpf: z.string().length(14).optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['morador', 'sindico']).optional(),
});

const idSchema = z.string().uuid();

export default class UserController {

    static async getAll(req, reply) {
        const users = await UserService.getAllUsers();
        reply.send(users);
    }

    static async getAllActives(req, reply) {
        const users = await UserService.getAllUserActives();
        reply.send(users);
    }

    static async getAllDeactivated(req, reply) {
        const users = await UserService.getAllUsersDeactivated();
        reply.send(users);
    }

    static async getById(req, reply) {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        reply.send(user)
    }

    static async create(req, reply) {
        const validateUser = createUserSchema.parse(req.body);
        const user = await UserService.createUser(validateUser);
        reply.status(201).send(user);
    }

    static async update(req, reply) {
        const validatedUser = updateUserSchema.parse(req.body);
        const updateUser = await UserService.updateUser(id, validatedUser);
        reply.send(updateUser);
    }

    static async deactivate(req, reply) {
        const { id } = idSchema.parse(req.params);
        const user = await UserService.deactivateUser(id);
        reply.status(200).send(user)
    }

}