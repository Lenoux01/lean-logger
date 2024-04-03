# lean-logs

lean-logs is a lightweight, efficient logging tool designed specifically for use with Bun and Elysia in Node.js environments. By offering a straightforward API and customizable log levels, Lean Logger aims to enhance debugging and monitoring in development and production without introducing significant overhead.

## Features
- **Colorized Output**: Utilizes `getMethodStringColor.ts` to color-code log messages based on the HTTP method or log level, improving readability and quick scanning.
- **Performance Timing**: With `getConvertedDuration.ts`, easily measure and log the duration of code execution, database queries, or HTTP requests in a human-readable format.
- **API Response Logging**: The `apiResponse.ts` utility allows for structured logging of API responses, facilitating better tracking of outgoing data and potential issues.
- **Extensive Testing**: Includes a suite of tests (`logger.test.ts`) to ensure reliability and stability across updates.
- **Customizable**: Offers various options for customization, allowing you to tailor the logger to fit your project's needs.
- **WebSocket Support**: Supports WebSocket communication, allowing for the logging of messages sent over WebSocket connections.
- **Custom Message Logging**: Supports custom message logging, enabling the creation and logging of custom messages that cater to your application's specific needs.


## Behavior
![Alt text](https://i.ibb.co/vC57JXH/lean-logs-Coloring.png)