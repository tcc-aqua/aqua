// npx sequelize-cli db:migrate --config src/config/config.js --migrations-path src/migrations --models-path src/models
module.exports = {
  development: {
    username: "root",
    password: null,
    database: "aqua",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "aqua",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "aqua",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
