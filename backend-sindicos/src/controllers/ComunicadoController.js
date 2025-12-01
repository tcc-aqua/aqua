import addComunicadoService from "../services/comunicados/addComunicado.js";
import criadosPeloSindico from "../services/comunicados/criadosPeloSindico.js";
import getComunicadosService from "../services/comunicados/getComunicado.js";
import getTotalComunicados from "../services/comunicados/getTotalComunicados.js";

export default class ComunicadosController {
    static async getAllComunicados(req, reply) {
        const sindico_id = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const comunicados = await getComunicadosService.getAllComunicados(page, limit, sindico_id);
        return reply.status(200).send(comunicados)
    }

    static async addComunicado(req, reply) {
        const { title, subject, addressee } = req.body;
        const sindicoId = req.user.id;

        const comunicado = await addComunicadoService.createComunicado({
            title,
            subject,
            addressee,
            sindico_id: sindicoId
        });

        return reply.status(200).send(comunicado)
    }

    static async getTotalCount(req, reply) {
        const sindico_id = req.user.id;
        const total = await getTotalComunicados.countTotalComunicados(sindico_id);
        return reply.status(200).send({ total });
    }

    static async getMyTotalCount(req, reply) {
        const sindico_id = req.user.id;
        const total = await criadosPeloSindico.countMyComunicados(sindico_id);
        return reply.status(200).send({ total });

    }

    static async updateLidoStatus(req, reply) {
        const { id: comunicado_id } = req.params;
        const { lido } = req.body; 
        const user_id = req.user.id; 

        if (typeof lido !== 'boolean') {
            return reply.status(400).send({ message: "O status 'lido' deve ser um booleano." });
        }

        const comunicado = await Comunicados.findByPk(comunicado_id, { attributes: ['sindico_id'] });
        if (comunicado && comunicado.sindico_id === user_id) {
            return reply.status(403).send({ message: "Você não pode marcar o status de leitura em comunicados criados por você." });
        }


        const [comunicadoLido] = await marcarComunicadoLidoService.updateStatusLido(
            comunicado_id,
            user_id,
            lido
        );

        const message = lido ? "Comunicado marcado como lido." : "Comunicado marcado como não lido.";
        return reply.status(200).send({ message, comunicadoLido });

    }

    static async getNaoLidosCount(req, reply) {
        const user_id = req.user.id; 
        const naoLidos = await marcarComunicadoLidoService.countNaoLidos(user_id);
        return reply.status(200).send({ total: naoLidos });
    }
}