module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "clwy1234",
    database: process.env.DB_DATABASE || "clwy_api_development",
    host: process.env.DB_HOST || "clwy-api",
    dialect: "mysql",
    timezone: "+08:00",
    LogQueryParameters: true
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "clwy_api_development",
    host: process.env.DB_HOST || "clwy-api",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "clwy_api_development",
    host: process.env.DB_HOST || "clwy-api",
    dialect: "mysql"
  }
};