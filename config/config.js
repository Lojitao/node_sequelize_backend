const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: envFile });

console.log('process.env.DB_USER',process.env.DB_USER);
console.log('process.env.DB_PASSWORD',process.env.DB_PASSWORD);
console.log('process.env.DB_DATABASE',process.env.DB_DATABASE);
console.log('process.env.DB_HOST',process.env.DB_HOST);
console.log('process.env.DB_CONTAINER_PORT',process.env.DB_CONTAINER_PORT);
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_CONTAINER_PORT,
    dialect: "mysql",
    timezone: "+08:00",
    LogQueryParameters: true
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_CONTAINER_PORT,
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_CONTAINER_PORT,
    dialect: "mysql"
  }
};

