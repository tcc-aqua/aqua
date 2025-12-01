import Comunicados from "../../models/Comunicados.js";
import User from "../../models/User.js";

export default class addComunicadoService {
    static async createComunicado({ title, subject, addressee, sindico_id }) {
        try {
            const sindico = await User.findByPk(sindico_id, {
                attributes: ['id', 'residencia_id'] 
            });

            if (!sindico) {
                throw new Error("Síndico não encontrado.");
            }

            if (addressee !== 'usuários') {
                throw new Error("Síndico só pode criar comunicados para usuários do seu condomínio.");
            }
            const condominioId = sindico.residencia_id; 

        

            const novo_comunicado = await Comunicados.create({
                title,
                subject,
                addressee,
                sindico_id: sindico_id, 
                condominio_id: condominioId 
            });

            return novo_comunicado;

        } catch (error) {
            console.error('Erro ao criar comunicado:', error);
            throw error;
        }
    }
}