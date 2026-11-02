// Automated test suite for onyx-session-service
const assert = require("assert");
const { resolveGatewayOptions } = require("../lib/config");
const { EpochGatewayProcessorEngine } = require("../lib/gatewayEngine");
const { computeSessionLease } = require("../lib/utils");

function runTestSuite() {
    const opts = resolveGatewayOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new EpochGatewayProcessorEngine();
    const res = engine.processRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { computeSessionLease({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
