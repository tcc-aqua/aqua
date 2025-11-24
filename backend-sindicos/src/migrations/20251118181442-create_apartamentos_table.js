'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('apartamentos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      condominio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'condominios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      numero: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      bloco: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      codigo_acesso: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        unique: true,
      },
      numero_moradores: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      sensor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sensores',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      responsavel_id: {
        type: Sequelize.CHAR(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo',
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('apartamentos');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_apartamentos_status";');
  }
};
