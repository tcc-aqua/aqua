    import { Model, DataTypes } from "sequelize";
    import sequelize from "../config/sequelize.js";
    import sequelizePaginate from 'sequelize-paginate'
    import Sensor from "./Sensor.js";
    import { nanoid } from "nanoid";

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
        uf: {
            type: DataTypes.STRING(2),
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
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
            type: DataTypes.CHAR(10),
            defaultValue: () => nanoid(5).replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('ativo', 'inativo'),
            allowNull: false,
            defaultValue: 'ativo'
        },
        responsavel_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: { model: 'users', key: 'id' }
}
    }, {
        sequelize,
        tableName: 'casas',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',

        hooks: {
            beforeValidate: (casa) => {
                if (casa.uf) {
                    casa.estado = estados[casa.uf] || casa.estado;
                }
            },
        },
    })

    sequelizePaginate.paginate(Casa);
