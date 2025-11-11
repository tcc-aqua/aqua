import TaxaVazamentoView from "../models/TaxaVazamentoView.js";

export default class TaxaVazamentoService {
    static async getAll(){
        try {
            const vazamentos = await TaxaVazamentoView.findAll();
            return vazamentos;
        } catch (error) {
            console.error('Erro ao listar taxa de vazamento', error);
            throw error;
        }
    }
}
