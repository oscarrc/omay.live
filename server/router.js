import { AdController, BanController, ChatController } from "./controllers/index.js";

import { __dirname } from "./lib/dirname.js";
import express from "express";
import fs from 'fs';
import { join } from 'path'

const router = express.Router();

router.get("/ad", AdController.get.bind(AdController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.ban.bind(BanController))

router.post("/chat", ChatController.find.bind(ChatController))
router.get("/chat", ChatController.count.bind(ChatController))

router.get("/", (req,res) => {   
    const file = join(__dirname, "../www", "index.html");

    process.env.NODE_ENV === "production" && fs.existsSync(file) ? 
        res.sendFile(file) :
        res.send("OK");
})

export default router