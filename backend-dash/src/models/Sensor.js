import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { nanoid } from 'nanoid';
import sequelizePaginate from 'sequelize-paginate'

export default class Sensor extends Model { }

Sensor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.CHAR(10), 
        defaultValue: () => nanoid(10), 
        allowNull: false,
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