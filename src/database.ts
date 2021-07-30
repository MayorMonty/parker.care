import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import { sqlite as config } from "../config.json";
import { logger } from "./main";
import { join } from "path";


interface Message {
    id: number;
    message: string;
    phone_number: string;
    created_at: string;
}

export async function database() {
    return sqlite.open({
        filename: join(process.cwd(), config.path),
        driver: sqlite3.cached.Database,
    });
};

export async function ensureSchema() {
    logger.info("Ensuring database compatibility...");
    const db = await database();
    
    // messages
    logger.info("Ensuring database compatibility: messages...");
    await db.run(
        `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY, 
            message TEXT,
            phone_number TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);

    logger.info("Ensuring database compatibility: COMPLETE!");

    const messages = await db.all<Message[]>("SELECT * FROM messages");
    if (messages) {
        logger.info(`${messages.length} stored and ready!`);
    } else {
        logger.info("No messages found!");
    }
    
};


export async function addMessage(message: string, phoneNumber: string) {
    const db = await database();
    await db.run(
        `INSERT INTO messages (message, phone_number) VALUES (?, ?)`,
        message, phoneNumber
    );
}

export async function getRandomMessage() {
    const db = await database();
    const message = await db.get<Message>(
        `SELECT * FROM messages ORDER BY RANDOM() LIMIT 1`
    );
    return message;
}