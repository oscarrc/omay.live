const express = require("express");
const router = express.Router();
const { ChatController, BanController } = require("./controllers/");

router.get("/", (req,res) => res.send("test"));

router.get("/chat", ChatController.get.bind(ChatController))

router.get("/ban", BanController.get.bind(BanController))
router.post("/ban", BanController.get.bind(BanController))

module.exports = router;