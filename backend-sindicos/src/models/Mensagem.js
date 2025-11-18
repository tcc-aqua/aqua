import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";
import Conversa from "./Conversa.js";

export default class Mensagem extends Model {}

Mensagem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    conversa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'conversas', key: 'id' }
    },
    remetente_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    remetente_tipo: {
        type: DataTypes.ENUM('admin', 'sindico'),
        allowNull: false
    },
    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    lida: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'mensagens',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
});

Mensagem.belongsTo(Conversa, {
    foreignKey: 'conversa_id',
    as: 'conversa'
});
