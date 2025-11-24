import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from "sequelize-paginate";
import Apartamento from "./Apartamento.js";

export default class UserView extends Model {}

UserView.init(
  {
    user_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    user_email: {
      type: DataTypes.STRING,
    },
    user_role: { 
      type: DataTypes.ENUM("morador", "sindico"),
    },
    user_type: { 
      type: DataTypes.ENUM("condominio"),
    },
    user_status: {
      type: DataTypes.ENUM("ativo", "inativo"),
    },
    residencia_type: { 
      type: DataTypes.ENUM("casa", "apartamento"),
    },
    residencia_id: {
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
    condominio_id: {
      type: DataTypes.INTEGER,
    },
    
  },
  {
    sequelize,
    tableName: "vw_users",
    timestamps: false,
  }
);

UserView.belongsTo(Apartamento, { foreignKey: 'residencia_id', as: 'apartamento' });
Apartamento.hasMany(UserView, { foreignKey: 'residencia_id', as: 'moradores' });

sequelizePaginate.paginate(UserView);
