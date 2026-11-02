// Utility helper functions for onyx-session-service
const crypto = require("crypto");
const { gatewayConfig } = require("./config");

function computeGatewayDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatGatewayMetric(label, value) {
    return `[${gatewayConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateGatewayState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Message broker session lifecycle management
function computeSessionLease(lastHeartbeat, now, timeoutMs, graceMs) {
  if (typeof lastHeartbeat !== 'number' || typeof now !== 'number' ||
      typeof timeoutMs !== 'number' || typeof graceMs !== 'number') {
    throw new TypeError('All parameters must be numbers');
  }
  if (timeoutMs < 0 || graceMs < 0) {
    throw new RangeError('timeoutMs and graceMs must be non-negative');
  }
  const elapsed = now - lastHeartbeat;
  const leaseMs = timeoutMs + graceMs;
  const remaining = Math.max(0, leaseMs - elapsed);
  const isExpired = remaining === 0;
  return {
    remainingMs: remaining,
    isExpired: isExpired,
    expiresAt: lastHeartbeat + leaseMs
  };
}

module.exports = {
    computeGatewayDigest,
    formatGatewayMetric,
    validateGatewayState,
    computeSessionLease
};
