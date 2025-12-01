import Comunicados from "../../models/Comunicados.js";

export default class criadosPeloSindico {

    static async countMyComunicados(sindico_id) {
        try {
            if (!sindico_id) {
                return 0;
            }

            const totalCreated = await Comunicados.count({
                where: {
                    sindico_id: sindico_id
                }
            });

            return totalCreated;

        } catch (error) {
            console.error("Erro ao contar comunicados criados pelo síndico:", error);
            throw error;
        }
    }
}