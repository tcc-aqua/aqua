import getUsersRegistrados from "../services/moradores/getUsers.js";
import GetUsuariosRegistradosAtivos from "../services/moradores/getUsuariosRegistrados.js";
import GetUsersInativos from "../services/moradores/getUsersInativos.js";
import GetUsersTotal from "../services/moradores/getTotalUsers.js";
import GetUsersWithAlert from "../services/moradores/getUsersComAlerta.js";

export default class MoradoresController {
    static async info(req, reply) {
        const sindico_id = req.user.id;
        const users = await getUsersRegistrados.getAllUsersRegistrados(sindico_id);
        const users_ativos = await GetUsuariosRegistradosAtivos.getUsersAtivosRegistrados(sindico_id);
        const users_inativos = await GetUsersInativos.getUsersRegistradosInativos(sindico_id);
        const count_users = await GetUsersTotal.getUsersRegistrados(sindico_id);
        const users_with_alert = await GetUsersWithAlert.count(sindico_id);

        return reply.status(200).send({
            users,
            count_users,
            users_ativos,
            users_inativos,
            users_with_alert
        })
    }
}