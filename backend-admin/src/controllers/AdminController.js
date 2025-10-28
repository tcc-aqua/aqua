import AdminService from "../services/AdminService.js";
import { createAdminDTO } from '../dto/admin/createAdminDTO.js';
import { updateAdminDTO } from "../dto/admin/updateAdminDTO.js";

export default class AdminController {

    static async getAll(req, reply) {
        const admins = await AdminService.getAllAdmins();
        return reply.status(200).send(admins);
    }

    static async getAllAtivos(req, reply) {
        const admins = await AdminService.getAllAdminsAtivos();
        return reply.status(200).send(admins);
    }

    static async getAllInativos(req, reply) {
        const admins = await AdminService.getAllAdminsInativos();
        return reply.status(200).send(admins);
    }

    static async create(req, reply){
        const validateAdmin = createAdminDTO.parse(req.body);
        const admin = await AdminService.create(validateAdmin);
        return reply.status(201).send(admin);
    }

    static async update(req, reply){
        const validateAdmin = updateAdminDTO.parse(req.body);
        const admin = await AdminService.update(validateAdmin);
        return reply.status(200).send(admin);
    }

    static async inativar(req, reply){
        const { id } = req.params;
        const admin = await AdminService.inativarAdmin(id);
        return reply.status(200).send(admin);
    }

    static async ativar(req, reply){
        const { id } = req.params;
        const admin = await AdminService.ativarAdmin(id);
        return reply.status(200).send(admin);
    }
}