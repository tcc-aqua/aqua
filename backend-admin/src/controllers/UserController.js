import UserService from "../services/UserService.js";

export default class UserController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await UserService.getAllUsers(page, limit);
        return reply.send(users);
    }
    static async getAllSindicos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const sindicos = await UserService.getAllUsersSindicos(page, limit);
        return reply.send(sindicos);
    }

    static async getAllActives(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await UserService.getAllUserActives(page, limit);
        return reply.send(users);
    }

    static async getAllDeactivated(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await UserService.getAllUsersDeactivated(page, limit);
        return reply.send(users);
    }

    static async getAllMoramCondominio(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await UserService.getAllUsersDeCondominio(page, limit);
        return reply.send(users);
    }

    static async getAllMoramEmCasa(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await UserService.getAllUsersDeCasa(page, limit);
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

    static async countAtivos(req, reply) {
        const users = await UserService.countUsersAtivos();
        return reply.status(200).send(users);
    }

    static async countSindicos(req, reply) {
        const sindicos = await UserService.countSindicos();
        return reply.status(200).send(sindicos);
    }

    static async countMoradores(req, reply) {
        const moradores = await UserService.countMoradores();
        return reply.status(200).send(moradores);
    }

    static async moradoresCasa(req, reply) {
        const moradores = await UserService.countMoradoresCasa();
        return reply.status(200).send(moradores);
    }

    static async moradoresApartamentos(req, reply) {
        const moradores = await UserService.countMoradoresApartamentos();
        return reply.status(200).send(moradores);
    }

    static async deactivate(req, reply) {
        const { id } = (req.params);
        const user = await UserService.deactivateUser(id);
        return reply.status(200).send(user)
    }

    static async ativar(req, reply) {
        const { id } = (req.params);
        const user = await UserService.ativarUser(id);
        return reply.status(200).send(user)
    }

    static async sindico(req, reply) {
        const { id } = req.params;
        const user = await UserService.setarSindico(id);
        return reply.status(200).send(user);
    }

}