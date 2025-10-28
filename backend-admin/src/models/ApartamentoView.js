import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from "sequelize-paginate";

export default class ApartamentoView extends Model {}

ApartamentoView.init(
  {
    apartamento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
      type: DataTypes.CHAR(10),
    },
    consumo_total: {
      type: DataTypes.DECIMAL(10, 2),
    },
    apartamento_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
    },
    sensor_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
    },
    ultimo_envio: {
      type: DataTypes.DATE,
    },
    condominio_nome: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "vw_apartamentos",
    timestamps: false,
  }
);

// Paginação
sequelizePaginate.paginate(ApartamentoView);
