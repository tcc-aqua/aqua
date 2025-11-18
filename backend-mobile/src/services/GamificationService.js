import GamificationLog from '../models/GamificationLog.js';

const PONTOS_POR_META_ATINGIDA = 50;

export default class GamificationService {

    static async awardPointsForCompletedGoal(userId, meta) {
        try {
            const reason = `Meta '${meta.periodo}' concluída com sucesso.`;
            await GamificationLog.create({
                user_id: userId,
                points: PONTOS_POR_META_ATINGIDA,
                reason: reason,
                related_id: meta.id,
                related_type: 'meta'
            });
            console.log(`+${PONTOS_POR_META_ATINGIDA} pontos para o usuário ${userId} por completar a meta ${meta.id}.`);
            return { success: true };
        } catch (error) {
            console.error('Erro ao atribuir pontos por meta concluída:', error);
            throw error;
        }
    }

    static async awardPointsForWaterSaved(userId, litersSaved) {
        try {
            // Lógica simples: 1 ponto a cada 20 litros economizados
            const points = Math.floor(litersSaved / 20);
            if (points > 0) {
                await GamificationLog.create({
                    user_id: userId,
                    points: points,
                    reason: `Economia de ${litersSaved.toFixed(2)}L de água.`,
                    related_type: 'economia'
                });
                console.log(`+${points} pontos para o usuário ${userId} por economizar água.`);
            }
            return { success: true };
        } catch (error) {
            console.error('Erro ao atribuir pontos por economia de água:', error);
            throw error;
        }
    }

    static async calculateTotalPoints(userId) {
        try {
            const totalPoints = await GamificationLog.sum('points', {
                where: { user_id: userId }
            });
            return totalPoints || 0;
        } catch (error) {
            console.error(`Erro ao calcular pontos totais para o usuário ${userId}:`, error);
            return 0;
        }
    }
}