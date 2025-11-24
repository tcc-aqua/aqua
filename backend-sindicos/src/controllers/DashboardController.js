import GetUsersTotal from "../services/dashboard/getUsersTotal.js";
import GetSensoresAtivos from "../services/dashboard/getSensoresAtivos.js";
import ConsumoTotalService from "../services/dashboard/getTopConsumo.js";
import getCondomonioInfo from "../services/dashboard/getCondomonioInfo.js";
import GetAlertasRecentes from "../services/dashboard/getAlertasRecentes.js";
import GetNovosMoradoresService from "../services/dashboard/getNovosMoradores.js";
import GetApartamentosAtivo from "../services/dashboard/getApartamentosAtivos.js";
import GetVazamentoConsumoService from "../services/dashboard/getVazamentoConsumo.js";

export default class DashboardController {
    static async info(req, reply) {
        const sindico_id = req.user.id; // vem do middleware
        const novosMoradores = await GetNovosMoradoresService.getNovosMoradores(sindico_id);
        const apartamentosAtivos = await GetApartamentosAtivo.getApartamentos(sindico_id);
        const totalUsuarios = await GetUsersTotal.getCountUsers(sindico_id);
        const sensoresAtivos = await GetSensoresAtivos.getSensoresAtivos(sindico_id);
        const consumoTotal = await ConsumoTotalService.getConsumoTotal(sindico_id);
        const consumo_vazamento = await GetVazamentoConsumoService.getRelatorio(sindico_id)
        const condominio = await getCondomonioInfo.getCondominio(sindico_id);
        const alertasRecentes = await GetAlertasRecentes.getAlertasRecentes(sindico_id);
        const usuariosRegistrados = await GetUsersTotal.getCountUsers(sindico_id);

        return reply.status(200).send({
            condominio,
            apartamentosAtivos,
            sensoresAtivos,
            usuariosRegistrados,
            consumo_vazamento,
            // totalUsuarios,
            novosMoradores,
            alertasRecentes,
            consumoTotal,
        });
    }
}
