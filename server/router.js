import { BanController, ChatController } from "./controllers/index.js";

import express from "express";

const router = express.Router();
router.get("/", (req,res) => res.send("test"));

router.post("/chat", ChatController.find.bind(ChatController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.ban.bind(BanController))

export default router