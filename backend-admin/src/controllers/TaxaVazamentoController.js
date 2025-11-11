import TaxaVazamentoService from "../services/TaxaVazamentoService.js";

export default class TaxaVazamentoController {
    static async get(req, reply){
        const vazamentos = await TaxaVazamentoService.getAll();
        return reply.status(200).send(vazamentos);
    }
}