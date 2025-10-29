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
    responsavel_email: {
      type: DataTypes.STRING,
    },
    responsavel_cpf: {
      type: DataTypes.STRING,
    },
    sensor_id: {
      type: DataTypes.INTEGER,
    },
    sensor_codigo: {
      type: DataTypes.STRING,
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
    cep: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.STRING,
    },
    cidade: {
      type: DataTypes.STRING,
    },
    uf: {
      type: DataTypes.CHAR(2),
    },
    bairro: {
      type: DataTypes.STRING,
    },
    numero: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "vw_casas",
    timestamps: false,
  }
);

sequelizePaginate.paginate(CasaView);
