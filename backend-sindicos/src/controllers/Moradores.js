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

            const sindico = await User.findByPk(sindico_id, {
                attributes: ['id', 'role', 'type', 'status', 'residencia_id', 'responsavel_id']
            });

            if (!sindico) {
                return reply.status(404).send({ message: "Síndico não encontrado." });
            }
            const condominio_id = await (async () => {
                if (sindico.residencia_id) {
                    const userInView = await getUsersRegistrados.getAllUsersRegistrados(1, 1, sindico_id);
                    if (userInView?.docs?.length > 0) return userInView.docs[0].condominio_id;
                }
                const anyUser = await getUsersRegistrados.getAllUsersRegistrados(1, 1, sindico_id);
                if (anyUser?.docs?.length > 0) return anyUser.docs[0].condominio_id;

                return null;
            })();

            if (!condominio_id) {
                return reply.status(404).send({ message: "Condomínio não encontrado para o síndico." });
            }

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
