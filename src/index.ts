import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import sequelize from "./db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
const PORT = process.env.AP_PORT || 3000;

// Set override to true if schema needs to be updated
const dbAlterOverride = true;

app.use(bodyParser.json());

// Function to initialize the database and start the server
async function init() {
  try {
    // Try to connect to the database
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync all models
    await sequelize.sync({ alter: dbAlterOverride });
    console.log("All models were synchronized successfully.");

    // Start the Express server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Use your routes
    app.use("/api", authRoutes);
    app.use("/api/admin", adminRoutes);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the application if we can't connect to the database
  }
}

// Initialize the application
init();
