import getUsersRegistrados from "../services/moradores/getUsers.js";
import GetUsuariosRegistradosAtivos from "../services/moradores/getUsuariosRegistrados.js";
import GetUsersInativos from "../services/moradores/getUsersInativos.js";

export default class MoradoresController {
    static async info(req, reply) {
        const sindico_id = req.user.id;
        const users = await getUsersRegistrados.getAllUsersRegistrados(sindico_id);
        const users_ativos = await GetUsuariosRegistradosAtivos.getUsersAtivosRegistrados(sindico_id);
        const users_inativos = await GetUsersInativos.getUsersRegistradosInativos(sindico_id);

        return reply.status(200).send({
            users,
            users_ativos,
            users_inativos
        })
    }
}