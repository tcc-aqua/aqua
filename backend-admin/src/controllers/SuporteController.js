import SuporteService from "../services/SuporteService.js";

export default class SuporteController {
    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const mensagens = await SuporteService.getAllMensagens(page, limit);
        return reply.status(200).send(mensagens)
    }

    static async enviarMensagem(req, reply) {
        const { id, resposta } = req.body;
        const mensagem = await SuporteService.responderMensagem(id, resposta);
        return reply.status(200).send(mensagem);
    }

    static async deletarMensagem(req, reply) {
        const { id } = req.params;
        const admin = req.admin;   

        const user_id = admin.id;
        const isAdmin = admin.type === 'admin' || admin.type === 'superadmin';

        const result = await SuporteService.deletarMensagem(id, user_id, isAdmin);

        return reply.send(result);
    }

    static async marcarComoVisualizada(req, reply) {
        const { id } = req.params;
        const user_id = req.admin.id;
        const registro = await SuporteService.marcarComoVisualizada(id, user_id);
        return reply.status(200).send(registro);
    }
}
