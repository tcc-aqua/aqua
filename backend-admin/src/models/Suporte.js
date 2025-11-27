import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import sequelizePaginate from "sequelize-paginate";

export default class Suporte extends Model {}

Suporte.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    assunto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    mensagem: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    remetente_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },

    destinatario_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
            model: User,
            key: "id"
        }
    },

    condominio_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tipo_destino: {
        type: DataTypes.ENUM("administrativo", "sindico", "usuario"),
        allowNull: false
    },

    resposta: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    respondido_por_email: {
        type: DataTypes.STRING(150),
        allowNull: true
    },

    respondido_por_tipo: {
        type: DataTypes.ENUM("administrativo", "sindico", "usuario"),
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM("pendente", "respondido"),
        defaultValue: "pendente"
    }
},
{
    sequelize,
    tableName: "suporte",
    timestamps: true,
    createdAt: "criado_em",
    updatedAt: "atualizado_em"
});

sequelizePaginate.paginate(Suporte);
