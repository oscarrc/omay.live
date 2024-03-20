import { AdController, BanController, ChatController } from "./controllers/index.js";

import { __dirname } from "./lib/dirname.js";
import express from "express";
import { join } from 'path'

const Router = () => {
    const router = express.Router();

    router.get("/ad", AdController.get.bind(AdController))

    router.get("/ban", BanController.get.bind(BanController))
          .post("/ban", BanController.ban.bind(BanController))
    
    router.get("/chat", ChatController.count.bind(ChatController))
          .post("/chat", ChatController.find.bind(ChatController))
    
    router.use('/tf', express.static(join(__dirname, "./tf")))

    return router;
}

export default Router