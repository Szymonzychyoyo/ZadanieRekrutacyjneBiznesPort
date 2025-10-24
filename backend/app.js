import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import sequelize from "./utils/database.js";
import messagesRouter from "./routes/messages.js";

// Initialize environment variables
config();

const app = express();

// CORS — pozwalamy na wywołania z frontu (localhost:3000)
app.use(cors({ origin: ["http://localhost:3000"], credentials: false }));

// Middleware
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Interview task" });
});

// API routes
app.use("/messages", messagesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const data = err.data || null;
  console.error(err);
  res.status(status).json({ success: false, message, data });
});

// Bootstrap: connect DB then start server
const port = process.env.PORT || 8080;

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("DB connection established.");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

bootstrap();
