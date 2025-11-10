import CrescimentoUserView from "../models/CrescimentoUserView.js";

export default class CrescimentoUsersService {

    static async getAll(){
        try {
            const crescimento = await CrescimentoUserView.findAll();
            return crescimento;
        } catch (error){
            console.error("Erro ao listar crescimento", error);
            throw error;
        }
    }

}