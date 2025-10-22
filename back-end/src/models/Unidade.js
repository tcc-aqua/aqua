import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Condominio from "./Condominio.js";
import sequelizePaginate from 'sequelize-paginate'
import Sensor from "./Sensor.js";

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
        type: DataTypes.STRING,
        allowNull: true
    },
    numero_moradores: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Sensor, key: 'id'}
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
    }
}, {
    sequelize,
    tableName: 'unidades',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})

sequelizePaginate.paginate(Unidade);
