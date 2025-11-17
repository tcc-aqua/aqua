import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'
import sequelizePaginate from 'sequelize-paginate'

export default class User extends Model {
    async checkPassword(password) {
        return bcrypt.compare(password, this.password)
    }
}

User.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cpf: {
        type: DataTypes.CHAR(14),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('casa', 'condominio'),
        allowNull: false
    },
    responsavel_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {model: 'users', key: 'id'}
    },
    residencia_type: {
        type: DataTypes.ENUM('casa', 'apartamento'),
        allowNull: true
    },
    residencia_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('morador', 'sindico'),
        defaultValue: 'morador',
        allowNull: false
    },
    notif_vazamento: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    notif_consumo_alto: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    notif_metas: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    notif_comunidade: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    notif_relatorios: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    hooks: {
        beforeCreate: async (user, options) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user, options) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt)
            }
        }
    }
})

sequelizePaginate.paginate(User);