import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";
import Conversa from "./Conversa.js";

export default class ConversaParticipante extends Model {}

ConversaParticipante.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    conversa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'conversas', key: 'id' }
    },
    usuario_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    usuario_tipo: {
        type: DataTypes.ENUM('admin', 'sindico'),
        allowNull: false
    },
    entrou_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'conversa_participantes',
    timestamps: false
});

ConversaParticipante.belongsTo(Conversa, {
    foreignKey: 'conversa_id',
    as: 'conversa'
});
