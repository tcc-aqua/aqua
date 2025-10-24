import Condominio from "../models/Condominio.js";
import Apartamento from "../models/Apartamento.js";
import Casa from '../models/Casa.js'

export default class ResidenciaService {

    static async getAllResidencias(){
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

}