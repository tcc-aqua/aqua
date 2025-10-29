import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from "sequelize-paginate";

export default class CasaView extends Model {}

CasaView.init(
  {
    casa_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    endereco: {
      type: DataTypes.STRING,
    },
    endereco_completo: {
      type: DataTypes.STRING,
    },
    numero_moradores: {
      type: DataTypes.INTEGER,
    },
    responsavel_nome: {
      type: DataTypes.STRING,
    },
    sensor_id: {
      type: DataTypes.INTEGER,
    },
    sensor_codigo: {
      type: DataTypes.CHAR(10),
    },
    consumo_total: {
      type: DataTypes.DECIMAL(10, 2),
    },
    casa_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
    },
    sensor_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
    },
    ultimo_envio: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "vw_casas",
    timestamps: false,
  }
);

sequelizePaginate.paginate(CasaView);