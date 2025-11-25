import SuporteService from "../services/SuporteService.js";

export default class SuporteController {
    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const mensagens = await SuporteService.getAllMensagens(page, limit);
        return reply.status(200).send(mensagens)
    }

    static async enviarMensagem(req, reply) {
        const { id, resposta, respondido_por } = req.body;
        const mensagem = await SuporteService.responderMensagem(id, resposta);
        return reply.status(200).send(mensagem);
    }

    static async deletarMensagem(req, reply) {
        const { id } = req.params;
        const user_id = req.user.id; // supondo que você tenha middleware de auth
        const isAdmin = req.user.role === "admin";
        const resultado = await SuporteService.deletarMensagem(id, user_id, isAdmin);
        return reply.status(200).send(resultado);
    }

    static async marcarComoVisualizada(req, reply) {
        const { id } = req.params; 
        const user_id = req.user.id;
        const registro = await SuporteService.marcarComoVisualizada(id, user_id);
        return reply.status(200).send(registro);
    }
}
