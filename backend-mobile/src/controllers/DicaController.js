import DicaService from "../services/DicaService.js";

export default class DicaController {
    static async getDicaDoDia(req, reply) {
        const dica = await DicaService.gerarDicaDoDia();
        return reply.status(200).send({dica});
    }
}