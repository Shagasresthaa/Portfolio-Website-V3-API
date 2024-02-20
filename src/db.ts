import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
    logging: false, // Set to console.log to see generated SQL queries
    dialectOptions: {
      // Conditionally apply SSL configuration only for production
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              // Caution: This disables certificate verification. Use a proper CA-signed certificate in production.
              rejectUnauthorized: false,
            }
          : {
              // Caution: This disables certificate verification. Use a proper CA-signed certificate in production.
              rejectUnauthorized: false,
            }, // No SSL for local development
    },
  }
);

export default sequelize;
