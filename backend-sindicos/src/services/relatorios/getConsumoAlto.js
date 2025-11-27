import Alertas from "../../models/Alertas.js";
import Apartamento from "../../models/Apartamento.js";
import Casa from "../../models/Casa.js";
import User from "../../models/User.js";

export default class ConsumoAlto {
    static async countConsumoAlto(sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) throw new Error("Síndico não encontrado");

            let condominioId;

            if (sindico.residencia_type === 'apartamento') {
                const apartamento = await Apartamento.findByPk(sindico.residencia_id);
                if (!apartamento) throw new Error("Apartamento do síndico não encontrado");
                condominioId = apartamento.condominio_id;
            } else if (sindico.residencia_type === 'casa') {
                const casa = await Casa.findByPk(sindico.residencia_id);
                if (!casa) throw new Error("Casa do síndico não encontrada");
                condominioId = casa.condominio_id; // se tiver, ou null
            }

            if (!condominioId) throw new Error("Síndico não está vinculado a um condomínio");

            // Pegar todos os apartamentos do condomínio
            const apartamentos = await Apartamento.findAll({
                where: { condominio_id: condominioId },
                attributes: ['id']
            });
            const apartamentoIds = apartamentos.map(a => a.id);

            // Contar alertas de consumo alto
            const resultado = await Alertas.count({
                where: {
                    tipo: "consumo_alto",
                    residencia_type: "apartamento",
                    resolvido: false,
                    residencia_id: apartamentoIds
                }
            });

            return resultado;

        } catch (error) {
            console.error("Erro ao contar alertas de consumo alto:", error);
            throw error;
        }
    }
}
