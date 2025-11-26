import MetasService from "../services/MetasService.js";

export default class MetasController {
    
    // Método para buscar todas as metas
    static async getAll(req, reply){
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Pega o ID do usuário autenticado pelo token
        const userId = req.user.id; 
        
        const metas = await MetasService.getAllMetas(userId, page, limit);
        return reply.status(200).send(metas);
    }


    static async create(req, reply){
        const userId = req.user.id; 
        const user = req.user;      

        // Passamos um objeto contendo userId, os dados do corpo (periodo, limite) e o objeto user
        const meta = await MetasService.createMeta({ 
            userId, 
            data: req.body, 
            user 
        });
        
        return reply.status(201).send(meta)
    }

    // Método para estatísticas
    static async getStats(req, reply) {
        const userId = req.user.id;
        const stats = await MetasService.getMetaStats(userId);
        return reply.status(200).send(stats);
    }
}