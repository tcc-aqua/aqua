import SensorController from "../controllers/SensorController.js";

export default async function sensorRoutes(fastify) {

        fastify.get('/', SensorController.getAll);
        fastify.get('/ativos', SensorController.getAllAtivos);
        fastify.get('/inativos', SensorController.getAllInativos);
        fastify.get('/count', SensorController.count);
        fastify.get('/count-ativos', SensorController.countAtivos);
        fastify.get('/consumo-total', SensorController.getConsumoTotalDosSensores);
        fastify.get('/consumo-total-casas', SensorController.getConsumoTotalCasas);
        fastify.get('/consumo-total-apartamentos', SensorController.getConsumoTotalApartamentos);
        fastify.post('/', SensorController.create);
        fastify.patch('/:id/inativar', SensorController.inativar);
        fastify.patch('/:id/ativar', SensorController.ativar);

}