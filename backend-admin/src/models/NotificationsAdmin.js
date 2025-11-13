import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import Notifications from "./Notifications.js";

export default class NotificationAdmin extends Model {}

NotificationAdmin.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notification_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Notifications,
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  admin_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: "NotificationAdmin",
  tableName: "notification_admins",
  timestamps: false
});

NotificationAdmin.belongsTo(Notifications, { foreignKey: "notification_id", as: "notification" });
NotificationAdmin.belongsTo(User, { foreignKey: "admin_id", as: "admin" });

