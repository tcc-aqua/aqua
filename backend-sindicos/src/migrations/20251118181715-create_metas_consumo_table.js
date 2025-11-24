'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('metas_consumo', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
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
      periodo: {
        type: Sequelize.ENUM('7_dias', '14_dias', '30_dias'),
        allowNull: false,
      },
      limite_consumo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      consumo_atual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('em_andamento', 'atingida', 'excedida'),
        allowNull: false,
        defaultValue: 'em_andamento',
      },
      inicio_periodo: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fim_periodo: {
        type: Sequelize.DATEONLY,
        allowNull: false,
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
    await queryInterface.dropTable('metas_consumo');
    // Limpar enums criados pelo Sequelize
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_metas_consumo_residencia_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_metas_consumo_periodo";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_metas_consumo_status";');
  }
};
