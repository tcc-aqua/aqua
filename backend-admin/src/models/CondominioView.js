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
    },
    condominio_codigo: {
      type: DataTypes.CHAR(10),
    },
    data_criacao: {
      type: DataTypes.DATE,
    },
    numero_apartamentos: {
      type: DataTypes.INTEGER,
    },
    numero_sensores: {
      type: DataTypes.INTEGER,
    },
    sindico_nome: {
      type: DataTypes.STRING,
    },
    condominio_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
    },
  },
  {
    sequelize,
    tableName: "vw_condominios",
    timestamps: false,
  }
);

sequelizePaginate.paginate(CondominioView);
