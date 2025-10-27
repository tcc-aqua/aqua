import ApartamentoService from "../services/ApartamentoService.js";

export default class ApartamentoController {

    static async getConsumo(req, reply){
        const {id} = req.params;
        const consumoTotal = await ApartamentoService.getConsumoTotal(id);
        return reply.status(200).send(consumoTotal);
    }

}
