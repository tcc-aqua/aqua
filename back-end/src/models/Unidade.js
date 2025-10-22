import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Condominio from "./Condominio.js";
import Sensores from "./Sensor.js";

export default class Unidade extends Model {}

Unidade.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    condominio_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Condominio, key: 'id'}
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bloco: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    numero_moradores: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {references: Sensores, key: 'id'}
    }
}, {
    sequelize,
    tableName: 'unidades',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})
