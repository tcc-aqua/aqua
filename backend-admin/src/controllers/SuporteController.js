import SuporteService from "../services/SuporteService.js";

export default class SuporteController{
    static async getAll(req, reply){
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const mensagens = await SuporteService.getAllMensagens(page, limit);
        return reply.status(200).send(mensagens)
    }

    static async enviarMensagem(req, reply){
        const mensagem = await SuporteService.responderMensagem(req.body);
        return reply.status(200).send(mensagem);
    }


}