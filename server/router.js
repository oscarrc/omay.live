import { BanController, ChatController } from "./controllers/index.js";

import express from "express";
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path'

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __index = path.join(__dirname, "./www", "index.html");

router.get("/", (req,res) => {
    process.env.NODE_ENV === "production" && fs.existsSync(__index) ? 
        res.sendFile(__index) :
        res.send("OK");
})

router.post("/chat", ChatController.find.bind(ChatController))
router.get("/chat", ChatController.count.bind(ChatController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.ban.bind(BanController))

export default router