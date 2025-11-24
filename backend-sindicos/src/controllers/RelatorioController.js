import ComparacaoComunicado from "../services/relatorios/getComparacaoComunicados.js";
import ConsumoAlto from "../services/relatorios/getConsumoAlto.js";
import ConsumoMedio from "../services/relatorios/getConsumoMedio.js";
import AlertasVazamentos from "../services/relatorios/getCountAlertasVazamentos.js";
import GetApartamentos from "../services/relatorios/getCountApartamentos.js";
import MediaMoradores from "../services/relatorios/getMediaMoradores.js";
import StatusSensores from "../services/relatorios/getStatusSensores.js";
import UsuariosAtivos from "../services/relatorios/getUsuariosAtivos.js";

export default class RelatorioController {
    static async info(req, reply){
        const sindico_id = req.user.id;
        const comunicados = await ComparacaoComunicado.getComunicadosResumo(sindico_id);
        const consumo_alto = await ConsumoAlto.countConsumoAlto(sindico_id);
        const consumo_medio = await ConsumoMedio.consumoMedio(sindico_id);
        const alertas_vazamentos = await AlertasVazamentos.countVazamentos(sindico_id);
        const qtd_apartamentos = await GetApartamentos.getApartamentos(sindico_id);
        const media_moradores = await MediaMoradores.getMediaMoradores(sindico_id);
        const status_sensores = await StatusSensores.getStatusCounts(sindico_id);
        const usuarios_ativos = await UsuariosAtivos.getStatusSemanal(sindico_id);
        
        return reply.status(200).send({
            comunicados,
            consumo_alto,
            consumo_medio,
            alertas_vazamentos,
            qtd_apartamentos,
            media_moradores,
            status_sensores,
            usuarios_ativos
        })
    }
}

// import GetUsersTotal from "../services/dashboard/getUsersTotal.js";
// import GetSensoresAtivos from "../services/dashboard/getSensoresAtivos.js";
// import ConsumoTotalService from "../services/dashboard/getTopConsumo.js";
// import getCondomonioInfo from "../services/dashboard/getCondomonioInfo.js";
// import GetAlertasRecentes from "../services/dashboard/getAlertasRecentes.js";
// import GetNovosMoradoresService from "../services/dashboard/getNovosMoradores.js";
// import GetApartamentosAtivo from "../services/dashboard/getApartamentosAtivos.js";
// import GetVazamentoConsumoService from "../services/dashboard/getVazamentoConsumo.js";

// export default class DashboardController {
//     static async info(req, reply) {
//         const sindico_id = req.user.id; // vem do middleware
//         const novosMoradores = await GetNovosMoradoresService.getNovosMoradores(sindico_id);
//         const apartamentosAtivos = await GetApartamentosAtivo.getApartamentos(sindico_id);
//         const totalUsuarios = await GetUsersTotal.getCountUsers(sindico_id);
//         const sensoresAtivos = await GetSensoresAtivos.getSensoresAtivos(sindico_id);
//         const consumoTotal = await ConsumoTotalService.getConsumoTotal(sindico_id);
//         const consumo_vazamento = await GetVazamentoConsumoService.getRelatorio(sindico_id)
//         const condominio = await getCondomonioInfo.getCondominio(sindico_id);
//         const alertasRecentes = await GetAlertasRecentes.getAlertasRecentes(sindico_id);
//         const usuariosRegistrados = await GetUsersTotal.getCountUsers(sindico_id);

//         return reply.status(200).send({
//             condominio,
//             apartamentosAtivos,
//             sensoresAtivos,
//             usuariosRegistrados,
//             consumo_vazamento,
//             // totalUsuarios,
//             novosMoradores,
//             alertasRecentes,
//             consumoTotal,
//         });
//     }
// }
