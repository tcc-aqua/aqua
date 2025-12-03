export default class GamificationService {

    static async awardPointsForCompletedGoal(userId, meta) {
        return { success: true };
    }

    static async awardPointsForWaterSaved(userId, litersSaved) {
        return { success: true };
    }

    static async calculateTotalPoints(userId) {
        return 0;
    }
}