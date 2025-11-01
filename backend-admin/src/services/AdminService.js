import Admin from '../models/Admin.js'

export default class AdminService {

    static async getAllAdmins(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                attributes: { exclude: ['password'] },
            }
            const admins = Admin.paginate(options);
            return admins;
        } catch (error) {
            console.error('Erro ao listar administradores', error);
            throw error;
        }
    }

    static async getAllAdminsAtivos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                 order: [['criado_em', 'DESC']],
                attributes: { exclude: ['password'] },
                where: { status: 'ativo' }

            }
            const admins = await Admin.paginate(options);
            return admins;
        } catch (error) {
            console.error('Erro ao listar administradores ativos', error);
            throw error;
        }
    }

    static async getAllAdminsInativos(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                attributes: { exclude: ['password'] },
                where: { status: 'inativo' }
            }
            const admins = await Admin.paginate(options);
            return admins;
        } catch (error) {
            console.error('Erro ao listar administradores inativos', error);
            throw error;
        }
    }

    static async createAdmin({ email, password }) {
        try {
            const admin = await Admin.create({
                email, password
            })
            return admin;
        } catch (error) {
            console.error('Erro ao criar administrador', error);
            throw error;
        }
    }

    static async updateAdmin(id, { email, type }) {
        try {
            const admin = await Admin.findByPk(id);
            if (!admin) {
                throw new Error('Administrador não encontrado');
            }
            await admin.update({
                email, type
            })
            return admin;
        } catch (error) {
            console.error('Erro ao atualizar administrador', error);
            throw error;
        }
    }

    static async inativarAdmin(id) {
        try {
            const admin = await Admin.findByPk(id);
            if (!admin) {
                throw new Error('Administrador não encontrado');
            }

            await admin.update({
                status: 'inativo'
            })

            return { message: 'Administrador inativado com sucesso!', admin }
        } catch (error) {
            console.error('Erro ao inativar administrador', error);
            throw error;
        }
    }

    static async ativarAdmin(id) {
        try {
            const admin = await Admin.findByPk(id);
            if (!admin) {
                throw new Error('Administrador não encontrado');
            }

            await admin.update({
                status: 'ativo'
            })

            return { message: 'Administrador ativado com sucesso!', admin }
        } catch (error) {
            console.error('Erro ao ativar administrador', error);
            throw error;
        }
    }

    static async updateMe(adminId, data) {
        try {
            const admin = await Admin.findByPk(adminId);
            if (!admin) throw new Error('Usuário não encontrado');

            await admin.update(data);
            const adminData = admin.toJSON();
            delete adminData.password;
            return adminData;
        } catch (error) {
            console.error('Erro ao atualizar usuário', error);
            throw error;
        }
    }

}