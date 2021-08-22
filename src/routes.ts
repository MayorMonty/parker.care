import app, { logger } from "./main"
import winston from "winston"
import expressWinston from "express-winston"
import { static as assets } from "express";
import { promises as fs } from "fs";
import { join } from "path";
import { addMessage, getRandomMessage } from "./database"
import formidable from "express-formidable";

// Form parsing
app.use(formidable());

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

// Serve submission page
app.get("/submit", async (req, res, next) => {
    res.sendFile(join(__dirname, "../../assets/submit.html"));
});

app.post("/submit", async (req, res, next) => {

  if (req.fields) {

    try {
      const { name, message } = req.fields;
      await addMessage(message.toString(), name.toString().toUpperCase());
      res.status(400).send({
        "status": "ok",
      });

    } catch (err) {
      res.status(500).send({
        "status": "error",
        "error_message": `Internal Server Error: ${err}`
      });
    }

  } else {
    res.status(400).send({
      "status": "error",
      "error_message": "No form data submitted"
    });
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