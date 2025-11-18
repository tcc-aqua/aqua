'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversa_participantes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      conversa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conversas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      usuario_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      usuario_tipo: {
        type: Sequelize.ENUM('admin', 'sindico'),
        allowNull: false,
      },
      entrou_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversa_participantes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_conversa_participantes_usuario_tipo";');
  }
};
