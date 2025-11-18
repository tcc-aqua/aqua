import User from './models/User.js';
import sequelize from './config/sequelize.js';

const seedSindico = async () => {
  try {
    await sequelize.authenticate();

    const existe = await User.findOne({ where: { email: 'paiva@gmail.com' } });

    if (!existe) {
      await User.create({
        name: "Gustavo Paiva",
        cpf: '111.121.111-11',
        email: 'paiva@gmail.com',
        type: 'condominio',
        password: 'paiva123', 
        residencia_type: 'apartamento',
        role: 'sindico',
      });

      console.log('Sindico criado com sucesso!');
    } else {
      console.log('Sindico já existe.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar sindico:', error);
    process.exit(1);
  }
};

seedSindico();
