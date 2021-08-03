import { twilio as config } from "../config.json"
import twilio from "twilio";
import { Router } from "express";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

const router = Router();

router.post("/twilio/sms", (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

export default router;