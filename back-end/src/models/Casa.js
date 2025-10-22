import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Sensores from "./Sensor.js";
import sequelizePaginate from 'sequelize-paginate'

export default class Casa extends Model {}

Casa.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    endereco: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    numero_moradores: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {references: Sensores, key: 'id'}
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
    }
}, {
    sequelize,
    tableName: 'casas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})

sequelizePaginate.paginate(Casa);
