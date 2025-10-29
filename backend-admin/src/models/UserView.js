import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from "sequelize-paginate";

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
    user_cpf: {
      type: DataTypes.STRING,
    },
    user_role: {
      type: DataTypes.ENUM("morador", "sindico"),
    },
    user_type: {
      type: DataTypes.ENUM("casa", "condominio"),
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
    endereco: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "vw_users",
    timestamps: false,
  }
);

sequelizePaginate.paginate(UserView);
