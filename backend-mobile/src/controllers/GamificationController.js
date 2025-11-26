import GamificationService from "../services/GamificationService.js";

export default class GamificationController {
    static async getRanking(req, reply) {
        // Retorna o top 10 usuários com mais pontos
        const ranking = await GamificationService.getRanking();
        return reply.status(200).send(ranking);
    }

    static async getDesafioColetivo(req, reply) {
        // Calcula o consumo total do condomínio/área vs meta coletiva
        const user = req.user;
        const desafio = await GamificationService.getDesafioColetivo(user);
        return reply.status(200).send(desafio);
    }
}