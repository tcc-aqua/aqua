import Comunicados from "../../models/Comunicados.js";
import User from "../../models/User.js";

export default class editComunicadoService {
    static async updateComunicado({ id, title, subject, addressee, sindico_id }) {
        try {
            const comunicado = await Comunicados.findByPk(id);
            if (!comunicado) {
                throw new Error("Comunicado não encontrado.");
            }

            if (comunicado.sindico_id !== sindico_id) {
                throw new Error("Você não tem permissão para editar este comunicado.");
            }

            // Atualiza os campos
            comunicado.title = title ?? comunicado.title;
            comunicado.subject = subject ?? comunicado.subject;
            comunicado.addressee = addressee ?? comunicado.addressee;

            await comunicado.save();

            return comunicado;
        } catch (error) {
            console.error("Erro ao editar comunicado:", error);
            throw error;
        }
    }
}
