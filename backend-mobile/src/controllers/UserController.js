import UserService from "../services/UserService.js";

export default class UserController {
    static async updateMe(req, reply) {

        const userId = req.user.id;
        const user = await UserService.updateMe(userId, req.body);
        return reply.status(200).send({ message: 'Perfil atualizado com sucesso!', user });
    }

    static async getStats(req, reply) {
        const userId = req.user.id;
        const stats = await UserService.getUserStats(userId);
        return reply.status(200).send(stats);
    }
}