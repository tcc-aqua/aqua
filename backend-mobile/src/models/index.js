import sequelize from '../config/sequelize.js';

import User from './User.js';
import Sensor from './Sensor.js';
import LeituraSensor from './LeituraSensor.js';
import Casa from './Casa.js';
import Apartamento from './Apartamento.js';
import Condominio from './Condominio.js';
import Metas from './Metas.js';
import PasswordReset from './PasswordReset.js';
import Comunicados from './Comunicados.js';

const initializeAssociations = () => {
    Sensor.hasMany(LeituraSensor, { foreignKey: 'sensor_id', as: 'leituras' });
    LeituraSensor.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });

    Apartamento.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });
    Casa.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });

    Apartamento.belongsTo(Condominio, { foreignKey: 'condominio_id', as: 'condominio' });
    Condominio.hasMany(Apartamento, { foreignKey: 'condominio_id', as: 'apartamentos' });

    User.belongsTo(Casa, { foreignKey: 'residencia_id', constraints: false, as: 'casa' });
    User.belongsTo(Apartamento, { foreignKey: 'residencia_id', constraints: false, as: 'apartamento' });
};

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
    PasswordReset,
    Comunicados
};
