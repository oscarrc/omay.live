import { BanController, ChatController } from "./controllers/index.js";

import express from "express";

const router = express.Router();
router.get("/", (req,res) => res.send("OK"));

router.post("/chat", ChatController.find.bind(ChatController))
router.get("/chat", ChatController.count.bind(ChatController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.ban.bind(BanController))

export default router