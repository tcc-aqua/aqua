import Admin from './models/Admin.js';
import sequelize from './config/sequelize.js';

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();

    const existe = await Admin.findOne({ where: { email: 'admin@empresa.com' } });

    if (!existe) {
      await Admin.create({
        email: 'admin@empresa.com',
        password: 'admin123', 
        type: 'superadmin',
      });

      console.log('Superadmin criado com sucesso!');
    } else {
      console.log('ℹ️ Superadmin já existe.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    process.exit(1);
  }
};

seedAdmin();
