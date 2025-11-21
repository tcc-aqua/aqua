import Comunicados from "../../models/Comunicados.js";

export default class addComunicadoService {
    static async createComunicado({title, subject, addressee } ){
        try {
            const novo_comunicado = await Comunicados.create({
                title,
                subject,
                addressee
            })
            return novo_comunicado;
        } catch (error) {
            console.error('Erro ao criar comunicado', error);
            throw error;
        }
    }
}