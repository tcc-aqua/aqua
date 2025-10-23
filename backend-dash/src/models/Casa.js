import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from 'sequelize-paginate'
import Sensor from "./Sensor.js";
import { v4 as uuidv4 } from 'uuid';

export default class Casa extends Model { }

Casa.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    logradouro: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    numero: {
        type: DataTypes.CHAR(10),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM(
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT',
            'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO',
            'RR', 'SC', 'SP', 'SE', 'TO'
        ),
        allowNull: false
    },
    cep: {
        type: DataTypes.CHAR(10),
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
        references: { model: Sensor, key: 'id' }
    },
    codigo_acesso: {
        type: DataTypes.CHAR(36),
        defaultValue: () => uuidv4(),
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
