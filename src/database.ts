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
    reads: number;
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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            reads INTEGER DEFAULT 0);
    `);

    // users by phone number
    logger.info("Ensuring database compatibility: users...");
    await db.run(
        `CREATE TABLE IF NOT EXISTS users (
            phone_number TEXT PRIMARY KEY,
            name TEXT);
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

export async function addUser(phoneNumber: string, name: string) {
        const db = await database();
    await db.run(
        `INSERT INTO users (phone_number, name) VALUES (?, ?)`,
        phoneNumber, name
    );
}

export async function getRandomMessage() {
    const db = await database();
    const message = await db.get<Message>(
        `SELECT * FROM (SELECT * FROM messages ORDER BY reads ASC LIMIT 10 OFFSET 5) ORDER BY RANDOM() LIMIT 1`
    );

    if (message) {

        const newReads = message.reads ? message.reads + 1 : 1;
        await db.run(
            `UPDATE messages SET reads = ? WHERE id = ?`,
            newReads, message.id
        );

        return message;

    };

    return message;
}