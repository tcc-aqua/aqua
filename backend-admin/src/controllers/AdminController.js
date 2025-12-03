import AdminService from "../services/AdminService.js";
import { createAdminDTO } from '../dto/admin/createAdminDTO.js';
import { updateAdminDTO } from "../dto/admin/updateAdminDTO.js";
import { updatePasswordDTO } from "../dto/admin/updatePasswordDTO.js";

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

    static async create(req, reply) {
        const validateAdmin = createAdminDTO.parse(req.body);
        const admin = await AdminService.createAdmin(validateAdmin);
        return reply.status(201).send(admin);
    }

    static async update(req, reply) {
        const { id } = req.params;
        const adminId = req.admin.id;
        const validateAdmin = updateAdminDTO.parse(req.body);
        const admin = await AdminService.updateAdmin(id, validateAdmin, adminId);
        return reply.status(200).send(admin);
    }

    static async inativar(req, reply) {
        const { id } = req.params;
        const adminId = req.admin.id;
        const admin = await AdminService.inativarAdmin(id, adminId);
        return reply.status(200).send(admin);
    }

    static async ativar(req, reply) {
        const { id } = req.params;
        const adminId = req.admin.id;
        const admin = await AdminService.ativarAdmin(id, adminId);
        return reply.status(200).send(admin);
    }

    static async updatePassword(req, reply) {
        const validatePassword = updatePasswordDTO.parse(req.body);
        const adminId = req.admin.id;
        const admin = await AdminService.updateMe(adminId, validatePassword);
        return reply.status(200).send(admin);
    }

    static async uploadProfile(req, reply) {
        if (!req.isMultipart()) {
            return reply.status(400).send({ message: 'O request não é multipart' });
        }

        try {
            const file = await req.file({ fieldname: 'profileImage' }).catch(() => null);
            console.log("Arquivo recebido:", file);
            if (!file) return reply.status(400).send({ message: 'Arquivo não enviado ou tipo inválido.' });

            if (!req.admin?.id) return reply.status(401).send({ message: 'Não autorizado' });

            const imgUrl = await AdminService.uploadProfilePicture(req.admin.id, file);

            return reply.status(200).send({
                message: 'Foto enviada com sucesso!',
                img_url: imgUrl
            });
        } catch (err) {
            console.error('Erro no upload de perfil:', err);
            return reply.status(500).send({ message: err.message || 'Erro interno ao enviar arquivo.' });
        }
    }

}
