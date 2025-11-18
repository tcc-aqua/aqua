import UserView from "../../models/UserView.js";
import User from "../../models/User.js"; 

export default class getUsers {
    static async getAllUsers(page = 1, limit = 10, sindico_id) {
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
                where: {
                    condominio_id: condominioId 
                },
                order: [['user_id', 'DESC']]
            }

            const usuarios = await UserView.paginate(options);
            return usuarios;
        } catch (error) {
            console.error("Erro ao listar todas as usuarios", error);
            throw error;
        }
    }
}