import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import { sqlite as config } from "../config.json";
import { logger } from "./main";
import { join } from "path";


export async function database() {
    return sqlite.open({
        filename: join(process.cwd(), config.path),
        driver: sqlite3.cached.Database,
    });
};

/**
 * Ensures the database is setup correctly.
 **/
export async function ensureSchema() {
    logger.info("Ensuring database compatibility...");
    const db = await database();
    
    // Users
    logger.info("Ensuring database compatibility: users...");
    await db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY, 
            username TEXT, 
            admin INTEGER, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);

    // User favorites
    logger.info("Ensuring database compatibility: favorites...");
    await db.run(
        `CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER, 
            place_id INTEGER, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);
    
    // Feedback submissions
    logger.info("Ensuring database compatibility: feedback...");
    await db.run(
        `CREATE TABLE IF NOT EXISTS feedback (
            user_id INTEGER, 
            place_id INTEGER,
            overall_satisfaction INTEGER,
            sensations_temperature INTEGER,
            sensations_air_quality INTEGER,
            preferences_temperature INTEGER,
            preferences_light INTEGER,
            preferences_sound INTEGER,
            clothing_level INTEGER,
            activity_type INTEGER,    
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);

    // Tokens
    logger.info("Ensuring database compatibility: tokens...");
    await db.run(
        `CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            token TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);

    logger.info("Ensuring database compatibility: COMPLETE!");

    const users = await db.get("SELECT * FROM USERS");
    logger.info(JSON.stringify(users));
    

};