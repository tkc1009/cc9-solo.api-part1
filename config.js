module.exports = {
  // database connection configs
  db: {
    client: "pg",
    connection: process.env.DB_URL || {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "pokemon",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
    },
  },

  // Poke API connection configs
  pokeapi: {
    baseURL: "https://pokeapi.co/api/v2",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    responseType: "json",
  },

  // port for server to run on
  express: {
    port: process.env.PORT || 4000,
  },

  // timestamp format for our logs
  logger: {
    format: "dddd MMMM Do YYYY, h:mm:ss a",
  },
};
