'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('condominios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      logradouro: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      numero: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      bairro: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      cidade: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      uf: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },
      estado: {
        type: Sequelize.CHAR(50),
        allowNull: true,
      },
      cep: {
        type: Sequelize.CHAR(9),
        allowNull: true,
      },
      codigo_acesso: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        unique: true,
      },
      sindico_id: {
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
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('condominios');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_condominios_status";');
  }
};
