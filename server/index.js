import { Db, Server, Socket } from "./server.js";

import chalk from 'chalk';
import cluster from "cluster"
import dotenv from "dotenv";
import http from "http";
import os from "os";
import router from "./router.js";
import { setupMaster } from "@socket.io/sticky";
import { setupPrimary } from "@socket.io/cluster-adapter";

dotenv.config();

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL || "localhost";
const MONGO_URL = process.env.MONGO_URL || null;
const WORKERS = process.env.WORKERS || os.cpus().length;
const PRODUCTION = process.env.NODE_ENV || false;

if (cluster.isPrimary) {	
	console.log(`${chalk.green.bold("[CLUSTER]")} Master running with PID ${process.pid}`);

	const server = http.createServer();

	setupMaster(server, { loadBalancingMethod: "least-connection" });
	setupPrimary();
	server.listen(PORT);

	for (let i = 0; i < WORKERS; i++) {
		cluster.fork();
	}

	cluster.on("online", (worker) => {		
		console.log(`${chalk.green.bold("[CLUSTER]")} Worker ${worker.id} running with PID ${worker.process.pid}`);
	})	

	cluster.on("exit", (worker) => {
		console.log(`${chalk.red.bold("[CLUSTER]")} Worker died with PID ${worker.process.pid}`);
		cluster.fork();
	})	
}else{
	const purge = cluster.worker.id === 1;
	
	Db(MONGO_URL, purge).then(() => {
		console.log(`${chalk.green.bold("[DB]")} Connection ready`);
	
		const server = Server(router, PRODUCTION).listen(PORT, () => {
			console.log(`${chalk.green.bold("[HTTP]")} Ready on ${BASE_URL}:${PORT}`);
			Socket(server);
			console.log(`${chalk.green.bold("[SOCKET]")} Ready on ${BASE_URL}:${PORT}`);
		})
	}).catch((e) => {
		console.log(`${chalk.red.bold("[ERROR]")} ${e}`);
	})
}