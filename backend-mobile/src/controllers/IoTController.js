import MonitoringService from "../services/MonitoringService.js";

export default class IoTController {
    static async receiveData(req, reply) {
        try {
            const { codigo, consumo, vazamento } = req.body;
            if (!codigo) return reply.status(400).send({ error: 'Código do sensor é obrigatório.' });

            const leitura = await MonitoringService.registrarLeitura(codigo, consumo || 0, vazamento || false);
            return reply.status(201).send({ message: 'Dados recebidos.', id: leitura.id });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ error: error.message });
        }
    }
}