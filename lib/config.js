// Configuration for onyx-session-service
const os = require("os");
const path = require("path");

const gatewayConfig = {
    appName: "onyx-session-service",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "7525", 10),
    timeoutMs: 29174,
    maxBufferItems: 204,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

function resolveGatewayOptions(overrides = {}) {
    return Object.assign({}, gatewayConfig, overrides);
}

module.exports = {
    gatewayConfig,
    resolveGatewayOptions
};
