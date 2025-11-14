// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\models\index.js
// NOVO ARQUIVO

import sequelize from '../config/sequelize.js';

// 1. Importar todos os modelos
import User from './User.js';
import Sensor from './Sensor.js';
import LeituraSensor from './LeituraSensor.js';
import Casa from './Casa.js';
import Apartamento from './Apartamento.js';
import Condominio from './Condominio.js';
import Metas from './Metas.js';
import PasswordReset from './PasswordReset.js';

// 2. Função para criar as associações
const initializeAssociations = () => {
    // Relação Sensor <-> LeituraSensor
    Sensor.hasMany(LeituraSensor, { foreignKey: 'sensor_id', as: 'leituras' });
    LeituraSensor.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });

    // Relação Residências -> Sensor
    Apartamento.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });
    Casa.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });

    // Outras relações importantes
    Apartamento.belongsTo(Condominio, { foreignKey: 'condominio_id', as: 'condominio' });
    Condominio.hasMany(Apartamento, { foreignKey: 'condominio_id', as: 'apartamentos' });

    User.belongsTo(Casa, { foreignKey: 'residencia_id', constraints: false, as: 'casa' });
    User.belongsTo(Apartamento, { foreignKey: 'residencia_id', constraints: false, as: 'apartamento' });
};

// 3. Exportar tudo
export {
    sequelize,
    initializeAssociations,
    User,
    Sensor,
    LeituraSensor,
    Casa,
    Apartamento,
    Condominio,
    Metas,
    PasswordReset
};