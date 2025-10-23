import UserService from "../services/UserService.js";

export default class UserController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await UserService.getAllUsers(page, limit);
        return reply.send(users);
    }

    static async getAllActives(req, reply) {
        const users = await UserService.getAllUserActives();
        return reply.send(users);
    }

    static async getAllDeactivated(req, reply) {
        const users = await UserService.getAllUsersDeactivated();
        return reply.send(users);
    }

    static async getById(req, reply) {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        return reply.send(user)
    }

    static async count(req, reply) {
        const users = await UserService.countUsers();
        return reply.status(200).send(users);
    }

    static async countAtivos(req, reply){
        const users = await UserService.countUsersAtivos();
        return reply.status(200).send(users);
    }

    static async deactivate(req, reply) {
        const { id } = (req.params);
        const user = await UserService.deactivateUser(id);
        return reply.status(200).send(user)
    }

    static async ativar(req, reply) {
        const { id } = idSchema.parse(req.params);
        const user = await UserService.ativarUser(id);
        return reply.status(200).send(user)
    }

}