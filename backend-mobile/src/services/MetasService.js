import Metas from "../models/Metas.js";
import User from "../models/User.js";
import GamificationService from "./GamificationService.js";

export default class MetasService {

    static async getAllMetas(userId, page = 1, limit = 10) {
        // Busca apenas as metas do usuário logado
        const options = {
            page,
            paginate: limit,
            where: { user_id: userId },
            order: [['criado_em', 'DESC']]
        }
        return Metas.paginate(options);
    }

    static async getMetaStats(userId) {
        try {
            const active = await Metas.count({ where: { user_id: userId, status: 'em_andamento' } });
            const completed = await Metas.count({ where: { user_id: userId, status: 'atingida' } });
            
            // Verifica se o GamificationService tem o método, senão retorna 0
            let points = 0;
            if (GamificationService && typeof GamificationService.calculateTotalPoints === 'function') {
                points = await GamificationService.calculateTotalPoints(userId);
            }

            return { active, completed, points };
        } catch (error) {
            console.error("Erro ao buscar stats de metas:", error);
            return { active: 0, completed: 0, points: 0 };
        }
    }

    static async createMeta({ userId, data, user }) {
        try {
            // Se o objeto 'user' não chegou aqui, tentamos buscar (fallback de segurança)
            if (!user) {
                user = await User.findByPk(userId);
                if (!user) throw new Error("Usuário não encontrado no banco de dados.");
            }

            const { periodo, limite_consumo } = data;

            // Validação simples
            if (!limite_consumo) throw new Error("O limite de consumo é obrigatório.");

            // Calcula datas automaticamente
            const inicio_periodo = new Date();
            const fim_periodo = new Date();
            
            let dias = 7;
            if (periodo === '14 dias' || periodo === '14_dias') dias = 14;
            if (periodo === '30 dias' || periodo === '30_dias') dias = 30;
            
            fim_periodo.setDate(fim_periodo.getDate() + dias);

            // Cria a meta usando os dados da residência do usuário
            const meta = await Metas.create({ 
                user_id: userId,
                residencia_id: user.residencia_id, 
                residencia_type: user.residencia_type, 
                periodo: periodo || '7 dias', 
                limite_consumo, 
                inicio_periodo,
                fim_periodo,
                status: 'em_andamento'
            });

            return meta;
        } catch (error) {
            console.error("Erro ao criar meta (Service):", error);
            throw error;
        }
    }
}