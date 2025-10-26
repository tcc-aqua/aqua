import Condominio from "../models/Condominio.js";
import Apartamento from "../models/Apartamento.js";
import Casa from '../models/Casa.js'
import { estados } from '../models/Condominio.js';
import sequelize from "../config/sequelize.js";

export default class ResidenciaService {

    static async getAllResidencias() {
        try {
            const totalCasas = await Casa.count();
            const totalApartamentos = await Apartamento.count();

            const totalResidencias = totalCasas + totalApartamentos;

            return {
                totalResidencias,
                totalCasas,
                totalApartamentos
            }
        } catch (error) {
            console.error('Erro ao buscar total de residencias', error);
            throw error;
        }
    }

    static async getAllDistribuicaoPorUf() {
        try {
            // Contar casas por UF
            const casasPorUf = await Casa.findAll({
                attributes: ['uf', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
                group: ['uf'],
                raw: true
            });

            // Contar condomínios por UF
            const condominiosPorUf = await Condominio.findAll({
                attributes: ['uf', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
                group: ['uf'],
                raw: true
            });

            const distribuicao = {};

            casasPorUf.forEach(c => {
                const nomeEstado = estados[c.uf] || c.uf;
                distribuicao[nomeEstado] = { casas: parseInt(c.total), condominios: 0 };
            });

            condominiosPorUf.forEach(c => {
                const nomeEstado = estados[c.uf] || c.uf;
                if (distribuicao[nomeEstado]) {
                    distribuicao[nomeEstado].condominios = parseInt(c.total);
                } else {
                    distribuicao[nomeEstado] = { casas: 0, condominios: parseInt(c.total) };
                }
            });

            return distribuicao;

        } catch (error) {
            console.error('Erro ao buscar distribuição por estado', error);
            throw error;
        }
    }

}
