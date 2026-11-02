# onyx-session-service

**Message broker session lifecycle management with deterministic timeout computation, heartbeat validation, and lease-based resource cleanup.**

## Overview & Problem Statement

In distributed message broker systems, sessions represent active client connections that consume or produce messages. Managing session lifecycles is critical to prevent resource leaks, stale connections, and inconsistent state. Traditional approaches often rely on naive timeout checks or periodic sweeps, which can lead to premature termination or zombie sessions.

Onyx Session Service provides a robust, deterministic mechanism to compute session lease expiration based on heartbeat timestamps, configurable timeout and grace periods. It ensures that sessions are only considered expired after a well-defined lease period, preventing accidental disconnects during transient network delays or brief client pauses.

The service integrates with broker infrastructure to track session heartbeats, validate them, and trigger cleanup when a lease expires. Its core algorithm is pure and testable, making it suitable for high-throughput environments where performance and predictability are paramount.

## Core Architecture & Highlights

- **Deterministic Lease Computation**: Uses a pure function to calculate remaining lease time, expiration timestamp, and expiry status from heartbeat timestamps.
- **Grace Period Support**: Separates timeout from grace, allowing clients a buffer before session termination.
- **Stateless Core**: The algorithm is stateless, enabling horizontal scaling and easy unit testing.
- **Event-Driven Cleanup**: Integrates with broker event loops to schedule cleanup on lease expiration, avoiding busy-waiting.
- **Configurable Parameters**: Timeout and grace durations are configurable per session or globally.
- **Low Overhead**: Minimal computational cost—O(1) per heartbeat/check operation.
- **Type Safety**: Input validation ensures robustness against malformed data.

## Installation

```bash
npm install onyx-session-service
```

## Quick Start

```javascript
const { computeSessionLease } = require('onyx-session-service');

// Session last heartbeat at time 1000ms, current time 1500ms
// Timeout 500ms, grace 200ms
const result = computeSessionLease(1000, 1500, 500, 200);

console.log(result);
// Output:
// {
//   remainingMs: 200,
//   isExpired: false,
//   expiresAt: 1700
// }

// If now is 1800ms, the session is expired
const expired = computeSessionLease(1000, 1800, 500, 200);
console.log(expired.isExpired); // true
```

## Configuration / Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeoutMs` | number | 30000 | Base session timeout in milliseconds |
| `graceMs` | number | 5000 | Additional grace period before expiry |
| `heartbeatIntervalMs` | number | 10000 | Recommended client heartbeat interval |
| `cleanupIntervalMs` | number | 1000 | Interval for checking expired sessions |

These options can be passed to the session manager constructor (if using the full service) or used directly with the algorithm.

## Performance & Design Constraints

- **O(1) Time Complexity**: The lease computation is constant-time, making it suitable for millions of sessions.
- **No External Dependencies**: The core algorithm uses only standard JavaScript, ensuring portability.
- **Memory Efficiency**: The service stores only essential session metadata (session ID, last heartbeat timestamp).
- **Deterministic Output**: Given the same inputs, the output is always identical, enabling reproducible behavior across nodes.
- **Lease-Based Cleanup**: Instead of relying on wall-clock timers, the service uses the lease expiration to schedule cleanup, reducing unnecessary wakeups.
- **Grace Period**: Prevents flapping due to network jitter, improving client experience.

## License

MIT License © 2026 Matilda Herzog (@benouy)