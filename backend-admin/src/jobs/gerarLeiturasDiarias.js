import axios from 'axios';
import LeituraSensor from '../models/LeituraSensor.js';
import Sensor from '../models/Sensor.js';
import Casa from '../models/Casa.js';
import Apartamento from '../models/Apartamento.js';

const MEDIA_POR_PESSOA = 150;
// const WEBHOOK_URL = 'http://localhost:5678/webhook/alerta-aqua';
 const WEBHOOK_URL = '';

export async function registrarLeitura(sensorId, consumo, vazamento = false) {
    const leitura = await LeituraSensor.create({
        sensor_id: sensorId,
        consumo,
        vazamento_detectado: vazamento,
        data_registro: new Date()
    });

    const sensor = await Sensor.findByPk(sensorId, {
        include: [
            { model: Casa, attributes: ['numero_moradores', 'responsavel_nome', 'responsavel_email'] },
            { model: Apartamento, attributes: ['numero_moradores', 'responsavel_nome', 'responsavel_email'] }
        ]
    });

    const moradores = sensor.Casa?.numero_moradores || sensor.Apartamento?.numero_moradores || 1;
    const limite = moradores * MEDIA_POR_PESSOA;

    if (consumo > limite || vazamento) {
        try {
            await axios.post(WEBHOOK_URL, {
                tipo: vazamento ? 'vazamento' : 'consumo_alto',
                usuario: sensor.Casa?.responsavel_nome || sensor.Apartamento?.responsavel_nome,
                email: sensor.Casa?.responsavel_email || sensor.Apartamento?.responsavel_email,
                consumo
            });
            console.log(`Webhook disparado para sensor ${sensorId}`);
        } catch (err) {
            console.error('Erro ao disparar webhook', err.message);
        }
    }
}
