import Comunicados from "../../models/Comunicados.js";

export default class deleteComunicadoService {
    static async removeComunicado({ id, sindico_id }) {
        try {
            const comunicado = await Comunicados.findByPk(id);
            if (!comunicado) {
                throw new Error("Comunicado não encontrado.");
            }

            // Só o criador pode remover
            if (comunicado.sindico_id !== sindico_id) {
                throw new Error("Você não tem permissão para remover este comunicado.");
            }

            await comunicado.destroy();

            return { message: "Comunicado removido com sucesso." };
        } catch (error) {
            console.error("Erro ao remover comunicado:", error);
            throw error;
        }
    }
}
