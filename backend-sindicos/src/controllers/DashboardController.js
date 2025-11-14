import GetUsersTotal from "../services/dashboard/getUsersTotal.js";
import GetSensoresAtivos from "../services/dashboard/getSensoresAtivos.js";
import ConsumoTotalService from "../services/dashboard/getTopConsumo.js";
import getCondomonioInfo from "../services/dashboard/getCondomonioInfo.js";

export default class DashboardController {
    static async info(req, reply) {
        const sindico_id = req.sindico.id; // vem do middleware

        const totalUsuarios = await GetUsersTotal.getCountUsers(sindico_id);
        const sensoresAtivos = await GetSensoresAtivos.getAtivos(sindico_id);
        const consumoTotal = await ConsumoTotalService.getConsumoTotal(sindico_id);
        const condominio = await getCondomonioInfo.getCondominio(sindico_id);

        return reply.status(200).send({
            totalUsuarios,
            sensoresAtivos,
            consumoTotal,
            condominio
        });
    }
}
