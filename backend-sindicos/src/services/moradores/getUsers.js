import UserView from "../../models/UserView.js";
import User from "../../models/User.js";
import Apartamento from "../../models/Apartamento.js";

export default class getUsersRegistrados {
    static async getAllUsersRegistrados(page = 1, limit = 10, sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id, {
                attributes: ['condominio_id']
            });

            if (!sindico || !sindico.condominio_id) {
                console.warn(`Síndico ou Condomínio ID não encontrado para o síndico ${sindico_id}`);
                return { data: [], total: 0 }; 
            }

            const condominioId = sindico.condominio_id;

            const options = {
                page,
                paginate: limit,
                include: [
                    {
                        model: Apartamento,
                        as: 'apartamento',
                        where: { condominio_id: condominioId },
                        required: true
                    }
                ],
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
