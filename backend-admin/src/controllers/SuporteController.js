import SuporteService from "../services/SuporteService.js";

export default class SuporteController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const mensagens = await SuporteService.getAllMensagens(page, limit);
        return reply.status(200).send(mensagens);
    }

    static async enviarMensagem(req, reply) {
        const { assunto, mensagem, tipo_destino, destinatario_id, condominio_id } = req.body;
        const admin = req.admin; // vem do middleware de autenticação

        const novaMensagem = await SuporteService.criarMensagem({
            assunto,
            mensagem,
            remetente: admin,
            tipo_destino,
            destinatario_id,
            condominio_id
        });

        return reply.status(201).send(novaMensagem);
    }

    static async responderMensagem(req, reply) {
        const { id, resposta } = req.body;
        const admin = req.admin;

        const mensagem = await SuporteService.responderMensagem(id, resposta, admin);

        return reply.status(200).send(mensagem);
    }

    // Deletar mensagem
    static async deletarMensagem(req, reply) {
        const { id } = req.params;
        const admin = req.admin;
        const user_id = admin.id;
        const isAdmin = admin.type === "admin" || admin.type === "superadmin";

        const result = await SuporteService.deletarMensagem(id, user_id, isAdmin);

        return reply.status(200).send(result);
    }

}
