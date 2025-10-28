import User from "../models/User.js";

export default class UpdateService {
    static async updateMe(userId, data) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('Usuário não encontrado');

            const { name, email, password } = data;
            await user.update({ name, email, password });
            return user;
        } catch (error) {
            console.error('Erro ao atualizar usuário', error);
            throw error;
        }
    }
}