import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from "sequelize-paginate";

export default class CondominioView extends Model {}

CondominioView.init(
  {
    condominio_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    condominio_nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    condominio_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    logradouro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uf: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    endereco_completo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numero_apartamentos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numero_sensores: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sindico_nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condominio_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "vw_condominios",
    timestamps: false,
  }
);

sequelizePaginate.paginate(CondominioView);
