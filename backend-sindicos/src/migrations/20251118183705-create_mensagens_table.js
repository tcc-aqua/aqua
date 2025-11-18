'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mensagens', {
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
      remetente_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      remetente_tipo: {
        type: Sequelize.ENUM('admin', 'sindico'),
        allowNull: false,
      },
      conteudo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lida: {
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
    await queryInterface.dropTable('mensagens');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_mensagens_remetente_tipo";');
  }
};
