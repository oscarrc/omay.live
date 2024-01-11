import { BanController, ChatController } from "./controllers/index.js";

import express from "express";
import path from 'path'

const router = express.Router();

router.get("/", (req,res) => {
    process.env.NODE_ENV === "production" ? 
        res.sendFile(path.join(__dirname, "../app", "index.html")) :
        res.send("OK");
})

router.post("/chat", ChatController.find.bind(ChatController))
router.get("/chat", ChatController.count.bind(ChatController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.ban.bind(BanController))

export default router