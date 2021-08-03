import express from "express"
import * as database from "./database"
import winston from "winston";

// Setup logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
    ),

    transports: [
        new winston.transports.Console()
    ]
});

export { logger };


const app = express();
app.listen(1337, async () => {
    logger.info("Listening for new connections!")

    await database.ensureSchema();

    await database.addMessage("We love you parker!", "864-520-9321");
    await database.addMessage("Parker is very pog!", "864-520-9321");
    await database.addMessage("I hate you NOT!", "864-520-9321");


    const message = await database.getRandomMessage();
    if (message) {
        logger.info(`[${message.created_at}] ${message.phone_number}: ${message.message} (#${message.id})`);
    } else {
        logger.info("No messages found!");
    }
});

export default app;
import "./routes"