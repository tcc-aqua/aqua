import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

export default class CrescimentoUserView extends Model {}

CrescimentoUserView.init({
    mes: {
        type: DataTypes.DATE,
        primaryKey: true
    },
    total_condominio: {
        type: DataTypes.INTEGER
    },
    total_casa: {
        type: DataTypes.INTEGER,
    },
    total_geral: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    tableName: 'view_crescimento_usuarios',
    freezeTableName: true,
    timestamps: false
})