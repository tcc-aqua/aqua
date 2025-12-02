import UserView from "../../models/UserView.js";
import User from "../../models/User.js";

export default class getUsersRegistrados {
    static async getAllUsersRegistrados(page = 1, limit = 10, sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);

            if (!sindico) {
                console.warn(`Síndico não encontrado para o ID ${sindico_id}`);
                return { data: [], total: 0 };
            }

            const options = {
                page,
                paginate: limit,
                where: { condominio_id: sindico.residencia_id || 1 }, 
                order: [['user_id', 'DESC']]
            };

            const usuarios = await UserView.paginate(options);

            return usuarios;
        } catch (error) {
            console.error("Erro ao listar todos os usuários", error);
            throw error;
        }
    }
}
