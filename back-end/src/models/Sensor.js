import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { v4 as uuidv4 } from 'uuid';
import sequelizePaginate from 'sequelize-paginate'

export default class Sensor extends Model { }

Sensor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.CHAR(36),
        defaultValue: () => uuidv4(),
        unique: true
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
    },
    consumo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ultimo_envio: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'sensores',
    timestamps: false
})

sequelizePaginate.paginate(Sensor);