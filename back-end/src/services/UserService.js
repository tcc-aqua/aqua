import User from "../models/User.js";

export default class UserService {

    // fazendo paginação de usuários para não sobracarregar o front-end com muitos dados
    static async getAllUsers(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                attributes: { exclude: ['password'] }
            }
            const users = await User.paginate(options);
            return users;
        } catch (error) {
            console.error('Erro ao buscar usuários', error);
            throw error;
        }
    }

    static async getAllUserActives(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                where: { status: 'ativo' },
                order: [['criado_em', 'DESC']],
                attributes: { exclude: ['password'] }
            }
            const users = await User.paginate(options);
            return users;
        } catch (error) {
            console.error('Erro ao buscar usuários', error);
            throw error;
        }
    }

    static async getAllUsersDeactivated(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                where: { status: 'inativo' },
                order: [['criado_em', 'DESC']],
                attributes: { exclude: ['password'] }
            }
            const users = await User.paginate(options);
            return users;
        } catch (error) {
            console.error('Erro ao buscar usuários', error);
            throw error;
        }
    }

    static async countUsers() {
        try {
            const users = await User.count();
            return users;
        } catch (error) {
            console.error('Erro ao listar contagem de usuários', error);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error("Usuário não encontrado");
            }
            return user;
        } catch (error) {
            console.error('Erro ao listar usuário.', error);
            throw error;
        }
    }

    static async createUser({ name, email, cpf, password, type, residencia_type, residencia_id }) {
        try {
            const user = await User.create({
                name, email, cpf, password, type, residencia_type, residencia_id
            })

            // removendo a senha no retorno por questões de segurança
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;

            return userWithoutPassword;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    static async updateUser(id, { name, email, cpf, password, role }) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const fieldsToUpdate = {};

            if (name !== undefined) fieldsToUpdate.name = name;
            if (email !== undefined) fieldsToUpdate.email = email;
            if (cpf !== undefined) fieldsToUpdate.cpf = cpf;
            if (password !== undefined) fieldsToUpdate.password = password;
            if (role !== undefined) fieldsToUpdate.role = role;

            await user.update(fieldsToUpdate);

            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;

            return userWithoutPassword;

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    static async deactivateUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('Usuário não encontrado.')
            }
            await user.update({ status: 'inativo' });
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;
            return { message: 'Usuário inativado com sucesso!', user: userWithoutPassword };
        } catch (error) {
            console.error('Erro ao inativar usuário:', error);
            throw error;
        }
    }

    static async ativarUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('Usuário não encontrado.')
            }
            await user.update({ status: 'ativo' });
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;
            return { message: 'Usuário ativado com sucesso!', user: userWithoutPassword };
        } catch (error) {
            console.error('Erro ao ativar usuário:', error);
            throw error;
        }
    }
}