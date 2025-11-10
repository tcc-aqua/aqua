import CrescimentoUsersService from "../services/CrescimentoUsersService.js";

export default class CrescimentoController {
    static async get(req, reply){
        const crescimentos = await CrescimentoUsersService.getAll();
        return reply.status(200).send(crescimentos)
    }
}