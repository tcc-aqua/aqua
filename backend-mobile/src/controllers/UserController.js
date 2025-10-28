import UpdateService from "../services/UserService.js";

export default class UpdateController {
    static async updateMe(req, reply) {
        const userId = req.user.id;
        const user = await UpdateService.updateMe(userId, req.body);
        return reply.status(200).send({ message: 'Perfil atualizado com sucesso!', user });
    }
}