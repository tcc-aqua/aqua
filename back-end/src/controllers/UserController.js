import UserService from "../services/UserService.js";

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

}