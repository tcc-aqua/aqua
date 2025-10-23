import Admin from '../models/Admin.js'

export default class AdminService {

    static async getAllAdmins(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
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
                order: [['criado_em'], 'DESC'],
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

    static async updateAdmin(id, { email, password, type }) {
        try {
            const admin = await Admin.findByPk(id);
            if (!admin) {
                throw new Error('Administrador não encontrado');
            }
            await admin.update({
                email, password, type
            })
            return admin;
        } catch (error) {
            console.error('Erro ao atualizar administrador', error);
            throw error;
        }
    }

    static async inativarAdmin(id){
        try {
            const admin = await Admin.findByPk(id);
              if (!admin) {
                throw new Error('Administrador não encontrado');
            }

            await admin.update({
                status: 'inativo'
            })

            return {message: 'Administrador inativado com sucesso!', admin}
        } catch (error) {
            console.error('Erro ao inativar administrador', error);
            throw error;
        }
    } 
    
    static async ativarAdmin(id){
        try {
            const admin = await Admin.findByPk(id);
              if (!admin) {
                throw new Error('Administrador não encontrado');
            }

            await admin.update({
                status: 'ativo'
            })

            return {message: 'Administrador ativado com sucesso!', admin}
        } catch (error) {
            console.error('Erro ao ativar administrador', error);
            throw error;
        }
    }


}