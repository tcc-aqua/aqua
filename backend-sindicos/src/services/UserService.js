import UserView from "../models/UserView.js";

export default class UserService {
    static async getAllUsers(page =1, limit =10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['user_id', 'DESC']]
            }
            const users = await UserView.paginate(options);
            return users;
        } catch (error) {
            console.error('Erro ao listar usuários', error);
            throw error;
        }
    }
}