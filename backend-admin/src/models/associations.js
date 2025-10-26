import Sensor from './Sensor.js';
import Casa from './Casa.js';
import Apartamento from './Apartamento.js';

// Sensores → Casas
Sensor.belongsTo(Casa, { foreignKey: 'residencia_id', as: 'casa' });
Casa.hasMany(Sensor, { foreignKey: 'residencia_id', as: 'sensores' });

// Sensores → Apartamentos
Sensor.belongsTo(Apartamento, { foreignKey: 'residencia_id', as: 'apartamento' });
Apartamento.hasMany(Sensor, { foreignKey: 'residencia_id', as: 'sensores' });
