import UserAlertService from "../services/relatorios/getConsumoAlto.js";
export default class RelatorioController {
   
    static async getUsersComConsumoAlto(req, reply){
            const sindicoId = req.user.id; 
            const consumo_alto = await UserAlertService.getUsersWithHighConsumptionAlert(sindicoId);
            return reply.status(200).send({ quantidade: consumo_alto });
    }
}