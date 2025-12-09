import getUsersRegistrados from "../services/moradores/getUsers.js";
import GetUsuariosRegistradosAtivos from "../services/moradores/getUsuariosRegistrados.js";
import GetUsersInativos from "../services/moradores/getUsersInativos.js";
import GetUsersTotal from "../services/moradores/getTotalUsers.js";
import GetUsersWithAlert from "../services/moradores/getUsersComAlerta.js";
import User from "../models/User.js";

export default class MoradoresController {
    static async info(req, reply) {
        try {
            const sindico_id = req.user.id;
            const condominio_id = req.user.condominio_id;

            if (!condominio_id) {
                return reply.status(404).send({ message: "Condomínio não encontrado para o síndico." });
            }

            // Pegando informações paginadas de usuários
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const users = await getUsersRegistrados.getAllUsersRegistrados(page, limit, sindico_id);
            const users_ativos = await GetUsuariosRegistradosAtivos.getUsersAtivosRegistrados(condominio_id);
            const users_inativos = await GetUsersInativos.getUsersRegistradosInativos(condominio_id);
            const count_users = await GetUsersTotal.getUsersRegistrados(condominio_id);
            const users_with_alert = await GetUsersWithAlert.count(condominio_id);

            return reply.status(200).send({
                users,
                count_users,
                users_ativos,
                users_inativos,
                users_with_alert
            });

        } catch (error) {
            console.error("Erro ao buscar informações dos moradores:", error);
            return reply.status(500).send({ message: "Erro interno do servidor." });
        }
    }
}
