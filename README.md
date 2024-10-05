# lean-logs: A Lightweight Logging Tool for Bun and Elysia

lean-logs is a powerful, efficient, and lightweight logging tool specifically designed for use with Bun and Elysia in Node.js environments. It offers a straightforward API and customizable log levels, making it an ideal choice for developers looking to enhance debugging and monitoring capabilities in both development and production environments without introducing significant overhead.

![Lean Logs Coloring](https://i.ibb.co/vC57JXH/lean-logs-Coloring.png)

## Features

- **Colorized Output**: Utilizes color-coding for log messages based on HTTP methods or log levels, improving readability and quick scanning.
- **Performance Timing**: Measures and logs the duration of code execution, database queries, or HTTP requests in a human-readable format.
- **API Response Logging**: Provides structured logging of API responses, facilitating better tracking of outgoing data and potential issues.
- **Extensive Testing**: Includes a comprehensive test suite to ensure reliability and stability across updates.
- **Customization Options**: Allows tailoring the logger to fit specific project needs.
- **WebSocket Support**: Supports logging of WebSocket communications for comprehensive monitoring of real-time applications.
- **Custom Message Logging**: Enables creation and logging of custom messages for application-specific requirements.

## Installation

To install lean-logs using Bun:

```bash
bun add @lenoux01/lean-logs
```

## Usage

### Basic Setup

```typescript
import { Elysia } from "elysia";
import { logger } from "@lenoux01/lean-logs";

const app = new Elysia()
  .use(logger())
  .get("/", () => "Hello World!")
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
```

### Customization

```typescript
import { Elysia } from "elysia";
import { logger } from "@lenoux01/lean-logs";

const app = new Elysia()
  .use(logger({
    logIP: true,
    logPath: "./custom-logs/app.log"
  }))
  .get("/", () => "Hello World!")
  .listen(3000);
```

### Logging WebSocket Communications

```typescript
import { Elysia } from "elysia";
import { logger, logWebSocket } from "@lenoux01/lean-logs";

const app = new Elysia()
  .use(logger())
  .ws("/ws", {
    message(ws, message) {
      logWebSocket(message);
      ws.send("Message received");
    },
  })
  .listen(3000);
```

## How It Works

lean-logs operates by intercepting requests and responses in your Elysia application:

1. **Request Logging**: Captures the start time and relevant information when a request is received.
2. **Response Logging**: Logs details such as HTTP method, path, status code, and response time after request handling.
3. **Error Logging**: Captures and logs error details if an error occurs during request processing.
4. **File Logging**: Writes all logs to both the console and a file (default: `logs/server.log`).
5. **WebSocket Logging**: Provides a separate logging function for WebSocket-specific information.

## Configuration Options

- `logIP`: Boolean flag to enable/disable logging of caller IP addresses.
- `logPath`: Custom path for the log file.

## Performance Considerations

lean-logs is designed to be lightweight and efficient, using `process.hrtime.bigint()` for accurate timing measurements. Logging operations are optimized to minimize impact on application performance.

## Testing

lean-logs includes a comprehensive test suite covering various scenarios including HTTP method logging, WebSocket logging, and error handling. To run the tests:

```bash
bun test
```

## Best Practices

1. **Environment-based Configuration**: Use different logging configurations for development and production environments.
2. **Log Rotation**: Implement log rotation to manage log file sizes, especially in production.
3. **Sensitive Data**: Be cautious about logging sensitive information, especially in request bodies or headers.
4. **Performance Monitoring**: Use timing information to identify and optimize slow endpoints or operations.

## Conclusion

lean-logs provides a robust, easy-to-use logging solution for Bun and Elysia applications. Its colorized output, performance timing, and WebSocket support make it valuable for improving application observability and debugging capabilities. With both console and file logging out of the box, lean-logs ensures comprehensive logging coverage for applications of all sizes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.