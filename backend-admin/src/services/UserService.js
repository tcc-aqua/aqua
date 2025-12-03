import User from "../models/User.js";
import UserView from "../models/UserView.js";
import { Sequelize } from "sequelize";
import AuditLogService from './AuditLog.js';


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
                where: { user_role: 'sindico' },
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
                where: { user_status: 'ativo' },
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
                where: { user_status: 'inativo' },
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

    static async deactivateUser(id, adminId) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('Usuário não encontrado.');

            const valorAntigo = user.status; // 

            await user.update({ status: 'inativo' });

            await AuditLogService.criarLog({
                user_id: user.id,
                acao: 'update',
                campo: 'status',
                valor_antigo: valorAntigo,
                valor_novo: 'inativo',
                alterado_por: adminId
            });

            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;
            return { message: 'Usuário inativado com sucesso!', user: userWithoutPassword };

        } catch (error) {
            console.error('Erro ao inativar usuário:', error);
            throw error;
        }
    }


    static async ativarUser(id, adminId) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('Usuário não encontrado.')
            }
            const valorAntigo = user.status; 

            await user.update({ status: 'ativo' });

            await AuditLogService.criarLog({
                user_id: user.id,
                acao: 'update',
                campo: 'status',
                valor_antigo: valorAntigo,
                valor_novo: 'ativo',
                alterado_por: adminId
            });
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;
            return { message: 'Usuário ativado com sucesso!', user: userWithoutPassword };
        } catch (error) {
            console.error('Erro ao ativar usuário:', error);
            throw error;
        }
    }

    static async setarSindico(id, admin) { 
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('Usuário não encontrado');

            if (user.type === 'casa') throw new Error('Esse usuário não faz parte de um condomínio');
            if (user.role === 'sindico') throw new Error('Esse usuário já é síndico');

            const valorAntigo = user.role;

            await user.update({
                role: "sindico"
            });

        
            await AuditLogService.criarLog({
                user_id: user.id,
                acao: 'update',
                campo: 'role',
                valor_antigo: valorAntigo,
                valor_novo: 'sindico',
                alterado_por: admin.id,       
                alterado_por_email: admin.email 
            });

            return user;

        } catch (error) {
            console.error('Erro ao atualizar para síndico', error);
            throw error;
        }
    }

    static async novosUsuariosUltimos6Meses() {
        const hoje = new Date();
        const seisMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);

        try {
            const total = await User.count({
                where: {
                    criado_em: {
                        [Sequelize.Op.gte]: seisMesesAtras
                    }
                }
            });

            return total;
        } catch (error) {
            console.error("Erro ao contar novos usuários dos últimos 6 meses:", error);
            throw error;
        }
    }
}