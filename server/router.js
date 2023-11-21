const express = require("express");
const router = express.Router();
const { ChatController, BanController } = require("./controllers/");

router.get("/", (req,res) => res.send("test"));

router.post("/chat", ChatController.find.bind(ChatController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.ban.bind(BanController))

module.exports = router;