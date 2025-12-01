import Casa from "../models/Casa.js";
import User from "../models/User.js";
import LeituraSensor from "../models/LeituraSensor.js";
import { Op } from "sequelize";

export default class CasaService {

    static async getConsumoTotal(casaId, userId) {
        console.log(`\n[DEBUG] Iniciando getConsumoTotal | CasaID: ${casaId} | UserID: ${userId}`);
        
        try {
            // 1. Validação do Usuário
            const user = await User.findByPk(userId);
            if (!user) throw new Error('Usuário não encontrado.');
            
            // Verifica se o ID da residência bate (convertendo para Inteiro para garantir)
            if (parseInt(user.residencia_id) !== parseInt(casaId) || user.residencia_type !== 'casa') {
                console.error(`[ERRO] Mismatch: UserResId: ${user.residencia_id}, ParamCasaId: ${casaId}, Type: ${user.residencia_type}`);
                throw new Error('Acesso não autorizado ou residência incorreta.');
            }

            // 2. Busca da Casa e Sensor
            const casa = await Casa.findByPk(casaId);
            if (!casa) throw new Error('Casa não encontrada.');
            
            if (!casa.sensor_id) {
                console.error(`[ERRO] Casa ${casaId} não tem sensor_id vinculado.`);
                throw new Error('Casa não possui um sensor associado.');
            }

            console.log(`[DEBUG] Sensor encontrado: ID ${casa.sensor_id}`);

            // 3. Definição de Datas (Tratamento de Fuso Horário Simples)
            const hojeInicio = new Date();
            hojeInicio.setHours(0, 0, 0, 0); // 00:00:00 de hoje

            const hojeFim = new Date();
            hojeFim.setHours(23, 59, 59, 999); // 23:59:59 de hoje

            const ontemInicio = new Date(hojeInicio);
            ontemInicio.setDate(ontemInicio.getDate() - 1); // 00:00:00 de ontem

            const ontemFim = new Date(hojeInicio); 
            // ontemFim é exatamente o inicio de hoje (exclusivo)

            console.log(`[DEBUG] Datas Filtro:`);
            console.log(`   -> Ontem: ${ontemInicio.toISOString()} até ${ontemFim.toISOString()}`);
            console.log(`   -> Hoje:  ${hojeInicio.toISOString()} até ${hojeFim.toISOString()}`);

            // 4. Consultas ao Banco
            // Consumo Total (Sempre acumula tudo)
            const consumoTotal = await LeituraSensor.sum('consumo', {
                where: { sensor_id: casa.sensor_id }
            });

            // Consumo Hoje
            const consumoHoje = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: casa.sensor_id,
                    data_registro: { 
                        [Op.gte]: hojeInicio,
                        [Op.lte]: hojeFim
                    }
                }
            });

            // Consumo Ontem
            const consumoOntem = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: casa.sensor_id,
                    data_registro: { 
                        [Op.gte]: ontemInicio,
                        [Op.lt]: ontemFim
                    }
                }
            });

            console.log(`[DEBUG] Resultados DB (Raw): Total=${consumoTotal}, Hoje=${consumoHoje}, Ontem=${consumoOntem}`);

            // 5. Tratamento de Valores (Null -> 0 e Float)
            const valHoje = parseFloat(consumoHoje) || 0;
            const valOntem = parseFloat(consumoOntem) || 0;
            const valTotal = parseFloat(consumoTotal) || 0;

            // 6. Cálculo da Comparação
            let comparacao = 0;
            if (valOntem > 0) {
                comparacao = ((valHoje - valOntem) / valOntem) * 100;
            } else if (valHoje > 0) {
                // Se ontem foi 0 e hoje tem consumo, aumentou 100% (simbolicamente)
                comparacao = 100; 
            }

            const resultado = { 
                consumoTotal: parseFloat(valTotal.toFixed(2)),
                consumoHoje: parseFloat(valHoje.toFixed(2)),
                consumoOntem: parseFloat(valOntem.toFixed(2)),
                comparacaoPorcentagem: parseFloat(comparacao.toFixed(1))
            };

            console.log(`[DEBUG] Retornando:`, resultado);
            return resultado;
            
        } catch (error) {
            console.error('[ERRO FATAL] CasaService:', error.message);
            throw error; // Repassa o erro para o Controller tratar
        }
    }
}