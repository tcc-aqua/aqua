import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/sequelize.js';
import Suporte from './Suporte.js';

export class SuporteLidos extends Model {}

SuporteLidos.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  suporte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Suporte, key: 'id' }
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  lido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  marcado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'suporte_lidos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['suporte_id', 'user_id']
    }
  ]
});

Suporte.hasMany(SuporteLidos, { foreignKey: 'suporte_id', as: 'leitura' });
SuporteLidos.belongsTo(Suporte, { foreignKey: 'suporte_id' });
User.hasMany(SuporteLidos, { foreignKey: 'user_id' });
SuporteLidos.belongsTo(User, { foreignKey: 'user_id' });