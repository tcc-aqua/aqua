import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/sequelize.js';
import sequelizePaginate from 'sequelize-paginate'

export default class SensorView extends Model {}

SensorView.init({
    sensor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    sensor_codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    residencia_type: {
        type: DataTypes.ENUM('casa', 'apartamento'),
        allowNull: true,
    },
    localizacao: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    consumo_total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    sensor_status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false
    },
    ultimo_envio: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "vw_sensores_residencias",
    timestamps: false
});

sequelizePaginate.paginate(SensorView);