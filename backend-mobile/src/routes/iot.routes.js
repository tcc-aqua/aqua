import IoTController from "../controllers/IoTController.js";

export default async function iotRoutes(fastify) {
    fastify.post('/leitura', {
        schema: {
            summary: 'Receber dados do Sensor',
            tags: ['IoT'],
            body: {
                type: 'object',
                properties: {
                    codigo: { type: 'string' },
                    consumo: { type: 'number' },
                    vazamento: { type: 'boolean' }
                }
            }
        }
    }, IoTController.receiveData);
}