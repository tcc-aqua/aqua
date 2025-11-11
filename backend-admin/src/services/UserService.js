import User from "../models/User.js";
import UserView from "../models/UserView.js";

export default class UserService {

    static async getAllUsers(page = 1, limit = 10) {
            try {
                const options = {
                    page,
                    paginate: limit,
                    order: [['user_id', 'DESC']]
                }
                const usuarios = await UserView.paginate(options);
                return usuarios;
            } catch (error) {
                console.error("Erro ao listar todas as usuarios", error);
                throw error;
            }
        }

         static async getAllUsersSindicos(page = 1, limit = 10) {
            try {
                const options = {
                    page,
                    paginate: limit,
                    where: {user_role: 'sindico'},
                    order: [['user_id', 'DESC']]
                }
                const sindicos = await UserView.paginate(options);
                return sindicos;
            } catch (error) {
                console.error("Erro ao listar todas as sindicos", error);
                throw error;
            }
        }


    static async getAllUserActives(page = 1, limit = 10) {
        try {
            
                const options = {
                    page,
                    paginate: limit,
                    where: {user_status: 'ativo'},
                    order: [['user_id', 'DESC']]
                }
                const usuarios = await UserView.paginate(options);
                return usuarios;
            } catch (error) {
                console.error("Erro ao listar todas as usuarios", error);
                throw error;
            }
        }
    
    

    static async getAllUsersDeactivated(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                where: {user_status: 'inativo'},
                order: [['user_id', 'DESC']]
            }
            const usuarios = await UserView.paginate(options);
            return usuarios;
        } catch (error) {
            console.error("Erro ao listar todas as usuarios", error);
            throw error;
        }
    }

    static async getAllUsersDeCondominio(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                where: { type: 'condominio' },
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
    static async getAllUsersDeCasa(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                where: { type: 'casa' },
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

    static async countUsersAtivos() {
        try {
            const users = await User.count({ where: { status: 'ativo' } });
            return users;
        } catch (error) {
            console.error('Erro ao listar contagem de usuários', error);
            throw error;
        }
    }

    static async countSindicos() {
        try {
            const users = await User.count({ where: { role: 'sindico' } });
            return users;
        } catch (error) {
            console.error('Erro ao listar contagem de sindicos', error);
            throw error;
        }
    }

    static async countMoradores() {
        try {
            const users = await User.count({ where: { role: 'morador' } });
            return users;
        } catch (error) {
            console.error('Erro ao listar contagem de moradores', error);
            throw error;
        }
    }

    static async countMoradoresCasa() {
        try {
            const users = await User.count({ where: { type: 'casa' } });
            return users;
        } catch (error) {
            console.error('Erro ao listar contagem de moradores', error);
            throw error;
        }
    }

    static async countMoradoresApartamentos() {
        try {
            const users = await User.count({ where: { type: 'condominio' } });
            return users;
        } catch (error) {
            console.error('Erro ao listar contagem de moradores', error);
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

    static async setarSindico(id){
        try {
            const user = await User.findByPk(id);
            if(!user) throw new Error('Usuario nao encontrado');

            if(user.type === 'casa') throw new Error('Esse usuário não faz parte de um condominio')
            if(user.role === 'sindico') throw new Error('Esse usuário ja é sindico')

                await user.update({
                    role: "sindico"
                })

                return user;
        } catch (error) {
            console.error('Erro ao atualizar para sindico', error);
            throw error;
        }
    }
}