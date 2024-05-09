import { AdController, BanController, ChatController } from "./controllers/index.js";

import express from "express";

const Router = () => {
    const router = express.Router();

    router.get("/", (req, res) => res.send("OK"))

    router.get("/ad", AdController.get.bind(AdController))

    router.get("/ban", BanController.get.bind(BanController))
          .post("/ban", BanController.ban.bind(BanController))
    
    router.get("/chat", ChatController.count.bind(ChatController))
          .post("/chat", ChatController.find.bind(ChatController))

    return router;
}

export default Router