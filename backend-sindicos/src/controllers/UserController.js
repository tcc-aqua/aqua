import UserService from "../services/UserService.js";

export default class UserController {
    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await UserService.getAllUsers(page, limit);
        return reply.status(200).send(users);
    }
}