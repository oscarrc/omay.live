import { Db, Server, Socket } from "./server.js";

import Router from "./router.js";
import chalk from 'chalk';
import cluster from "cluster"
import dotenv from "dotenv";
import http from "http";
import os from "os";
import { setupMaster } from "@socket.io/sticky";
import { setupPrimary } from "@socket.io/cluster-adapter";

dotenv.config();

const CPUS = os.cpus().length;
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || null;
const BASE_URL = process.env.BASE_URL || "localhost";
const WORKERS = process.env.WORKERS <= CPUS && process.env.WORKERS || CPUS || 1;
const PRODUCTION = process.env.NODE_ENV === "production" || false;

if (cluster.isPrimary) {	
	console.log(`${chalk.green.bold("[CLUSTER]")} Master running with PID ${process.pid}`);

	const server = http.createServer();

	setupMaster(server, { loadBalancingMethod: "least-connection" });
	setupPrimary();
	
	server.listen(PORT, () => {
		console.log(`${chalk.green.bold("[SERVER]")} Ready on ${BASE_URL}:${PORT}`);
	});

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
	const port = parseInt(PORT) + cluster.worker.id;

	Db(MONGO_URL, purge).then(() => {
		console.log(`${chalk.green.bold("[DB]")} ${chalk.green(`[${cluster.worker.id}]`)} Connection ready`);

		const router = Router(PRODUCTION);

		const server = Server(router).listen(port, () => {
			console.log(`${chalk.green.bold("[HTTP]")} ${chalk.green(`[${cluster.worker.id}]`)} Ready on ${BASE_URL}:${port}`);
			Socket(server);
			console.log(`${chalk.green.bold("[SOCKET]")} ${chalk.green(`[${cluster.worker.id}]`)} Ready on ${BASE_URL}:${port}`);
		})
	}).catch((e) => {
		console.log(`${chalk.red.bold("[ERROR]")} ${chalk.bgRed.bold(` ${cluster.worker.id} `)} ${e}`);
	})
}