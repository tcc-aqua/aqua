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
    apartamento_codigo: {      
      type: DataTypes.CHAR(10),
    },
    condominio_id: {
      type: DataTypes.INTEGER,
    },
    condominio_nome: {
      type: DataTypes.STRING,
    },
    logradouro: {
      type: DataTypes.STRING,
    },
    condominio_numero: {
      type: DataTypes.STRING,
    },
    bairro: {
      type: DataTypes.STRING,
    },
    cidade: {
      type: DataTypes.STRING,
    },
    uf: {
      type: DataTypes.STRING(2),
    },
    cep: {
      type: DataTypes.STRING(9),
    },
    endereco_completo: {
      type: DataTypes.STRING,
    },
    endereco_condominio: {
      type: DataTypes.STRING,
    },
    numero_moradores: {
      type: DataTypes.INTEGER,
    },
    responsavel_id: {        
      type: DataTypes.CHAR(36),
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
  },
  {
    sequelize,
    tableName: "vw_apartamentos",
    timestamps: false,
  }
);

sequelizePaginate.paginate(ApartamentoView);
