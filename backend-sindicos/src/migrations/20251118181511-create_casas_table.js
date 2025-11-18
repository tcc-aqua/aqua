'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('casas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      logradouro: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bairro: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      numero: {
        type: Sequelize.CHAR(10),
        allowNull: false,
      },
      cidade: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      uf: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      cep: {
        type: Sequelize.CHAR(10),
        allowNull: false,
      },
      numero_moradores: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
      codigo_acesso: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo',
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
    await queryInterface.dropTable('casas');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_casas_status";');
  }
};
