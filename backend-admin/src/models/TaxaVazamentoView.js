import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

export default class TaxaVazamentoView extends Model {}

TaxaVazamentoView.init({
    total_leituras: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    total_vazamentos: {
        type: DataTypes.INTEGER
    },
    percentual_vazamentos: {
        type: DataTypes.DECIMAL(10, 2)
    }
}, {
    sequelize,
    tableName: 'vw_taxa_vazamentos_geral',
    freezeTableName: true,
    timestamps: false
})