import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Sensor from "./Sensor.js";
import sequelizePaginate from 'sequelize-paginate'

export default class LeituraSensor extends Model {}

LeituraSensor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Sensor, key: 'id'}
    },
    consumo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    vazamento_detectado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    data_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'leituras_sensores',
    timestamps: false
})


sequelizePaginate.paginate(LeituraSensor);