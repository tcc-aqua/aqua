import { Model  , DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'
import sequelizePaginate from 'sequelize-paginate'

export default class Admin extends Model {
    // compare hash password
    async checkPassword(password) {
        return bcrypt.compare(password, this.password)
    }
}


Admin.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('superadmin', 'admin'),
        default: 'admin',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
    }
}, {
    sequelize,
    tableName: 'admins',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',

    hooks: {
        
        // hash create user
        beforeCreate: async (user, options) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        
        // hash update user
        beforeUpdate: async (user, options) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt)
            }
        }
    }
})
sequelizePaginate.paginate(Admin);