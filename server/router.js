import { AdController, BanController, ChatController } from "./controllers/index.js";

import { __dirname } from "./lib/dirname.js";
import express from "express";
import fs from 'fs';
import { join } from 'path'

const Router = (production) => {
    const router = express.Router();

    router.get("/ad", AdController.get.bind(AdController))

    router.get("/ban", BanController.get.bind(BanController))
          .post("/ban", BanController.ban.bind(BanController))
    
    router.get("/chat", ChatController.count.bind(ChatController))
          .post("/chat", ChatController.find.bind(ChatController))

    if(production){
        router.use('/', express.static(join(__dirname, "../../www")))
              .use('/model', express.static(join(__dirname, "../../model")))
    }

    router.get("*", (req,res) => {   
        const file = join(__dirname, "../../www", "index.html");
        console.log(file)
        process.env.NODE_ENV === "production" && fs.existsSync(file) ? 
            res.sendFile(file) :
            res.send("OK");
    })

    return router;
}

export default Router