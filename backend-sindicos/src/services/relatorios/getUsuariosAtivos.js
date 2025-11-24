import HistoricoStatusUsuario from "../../models/HistoricoStatusUsuario.js";
import { Sequelize, Op } from "sequelize";

export default class UsuariosAtivos {
    static async getStatusSemanal() {
        try {
            const hoje = new Date();
            const diaSemana = hoje.getDay();

            const segunda = new Date(hoje);
            segunda.setDate(hoje.getDate() - ((diaSemana + 6) % 7));
            segunda.setHours(0, 0, 0, 0);

            const domingo = new Date(segunda);
            domingo.setDate(segunda.getDate() + 6);
            domingo.setHours(23, 59, 59, 999);

            const dados = await HistoricoStatusUsuario.findAll({
                attributes: [
                    [Sequelize.fn("DATE", Sequelize.col("data_registro")), "data_registro"],
                    [
                        Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN status = 'ativo' THEN 1 ELSE 0 END`)),
                        "ativos"
                    ],
                    [
                        Sequelize.fn("SUM", Sequelize.literal(`CASE WHEN status = 'inativo' THEN 1 ELSE 0 END`)),
                        "inativos"
                    ]
                ],
                where: {
                    data_registro: {
                        [Op.between]: [segunda, domingo]
                    }
                },
                group: [Sequelize.fn("DATE", Sequelize.col("data_registro"))],
                order: [[Sequelize.fn("DATE", Sequelize.col("data_registro")), "ASC"]],
                raw: true
            });

            return dados;

        } catch (error) {
            console.error("Erro ao buscar status semanal:", error);
            throw error;
        }
    }
}
