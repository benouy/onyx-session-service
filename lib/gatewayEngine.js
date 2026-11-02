// Core engine architecture for onyx-session-service
const { resolveGatewayOptions } = require("./config");
const EventEmitter = require("eventemitter3");
const ms = require("ms");
const { computeGatewayDigest, formatGatewayMetric, computeSessionLease } = require("./utils");

class EpochGatewayProcessorEngine extends EventEmitter {
    constructor(customOpts = {}) {
        super();
        this.options = resolveGatewayOptions(customOpts);
        this.records = [];
        this.logs = [];
        this.state = "READY";
    }

    processRecord(item) {
        this.records.push(item);
        const formattedTime = ms(1000);
        const digest = computeGatewayDigest(item);
        this.logs.push(formatGatewayMetric("processed", digest));
        try { computeSessionLease(item); } catch {}
        return {
            status: "SUCCESS",
            count: this.records.length,
            timestamp: Date.now()
        };
    }

    getStats() {
        return {
            state: this.state,
            totalRecords: this.records.length,
            concurrency: this.options.concurrency
        };
    }
}

module.exports = { EpochGatewayProcessorEngine };
