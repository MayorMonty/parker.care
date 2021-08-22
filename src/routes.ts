import app, { logger } from "./main"
import winston from "winston"
import expressWinston from "express-winston"
import { static as assets } from "express";
import { promises as fs } from "fs";
import { join } from "path";
import { getRandomMessage } from "./database"

// Setup logging 
app.use(expressWinston.logger({
  winstonInstance: logger,
}));

// Dynamic Message Insertion
app.get("/message.json", async (req, res, next) => {
  try {
    const message = await getRandomMessage();
    res.json(message);
  } catch (err) {
    next();
  }
});


// Static Content
app.use(assets(join(__dirname, "../../assets")));

// Default handlers
app.use((req, res) => {
  res.status(404).json({
    "status": "error",
    "error_message": "Could not find route specified"
  });
});

// Error handling 
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}));