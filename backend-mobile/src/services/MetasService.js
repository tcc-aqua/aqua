import Metas from "../models/Metas.js";
import User from "../models/User.js";
import GamificationService from "./GamificationService.js"; // Importado

export default class MetasService {

    static async getAllMetas(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
            }
            const metas = Metas.paginate(options);
            return metas;
        } catch (error) {
            console.error('Erro ao listar metas do usuário', error);
            throw error;
        }
    }

    static async createMeta({ userId, data }) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error("Usuário não encontrado");

            const { residencia_id, residencia_type, periodo, limite_consumo, inicio_periodo } = data;

            const meta = await Metas.create({ 
                user_id: userId,
                residencia_id, 
                residencia_type, 
                periodo, 
                limite_consumo, 
                inicio_periodo 
            });


            return meta;
        } catch (error) {
            console.error("Erro ao criar meta", error);
            throw error;
        }
    }
}