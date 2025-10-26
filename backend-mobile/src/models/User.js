import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export default class User extends Model {
    //hash
    async checkPassword(password) {
        return bcrypt.compare(password, this.password)
    }
}

User.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4()
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('usuario', 'admin')
    }
}, {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',

    hooks: {
        beforeCreate: async (user) => {
            if(user.senha){
                const salt = await bcrypt.genSalt(10);
                user.senha = await bcrypt.hash(user.senha, salt);
            }
        },
        beforeUpdate: async (user) => {
            if(user.changed('senha')) {
                const salt = await bcrypt.genSalt(10);
                user.senha = await bcrypt.hash(user.senha, salt)
            }
        }
    }
})