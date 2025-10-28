import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import { nanoid } from 'nanoid';
import sequelizePaginate from 'sequelize-paginate'

export const estados = {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins",
};

export default class Condominio extends Model { }

Condominio.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    logradouro: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    uf: {
        type: DataTypes.STRING(2),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    cep: {
        type: DataTypes.CHAR(9),
        allowNull: false
    },
    codigo_acesso: {
        type: DataTypes.CHAR(10),
        defaultValue: () => nanoid(5).replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
        allowNull: false,
        unique: true
    },
    sindico_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: { model: User, key: 'id' }
    },
    status: {
        type: DataTypes.ENUM("ativo", 'inativo'),
        defaultValue: 'ativo',
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'condominios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',

    hooks: {
        beforeValidate: (condominio) => {
            if (condominio.uf) {
                condominio.estado = estados[condominio.uf] || condominio.estado;
            }
        },
    },
})

sequelizePaginate.paginate(Condominio);
