const pino = require("pino");
const logFile = pino.destination('app.log');

const logger = pino(logFile);

module.exports = logger;