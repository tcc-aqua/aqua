'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alertas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sensor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sensores',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      residencia_type: {
        type: Sequelize.ENUM('casa', 'apartamento'),
        allowNull: false,
      },
      residencia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('vazamento', 'consumo_alto'),
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nivel: {
        type: Sequelize.ENUM('baixo', 'medio', 'alto', 'critico'),
        allowNull: false,
        defaultValue: 'baixo',
      },
      resolvido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alertas');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_alertas_residencia_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_alertas_tipo";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_alertas_nivel";');
  }
};
