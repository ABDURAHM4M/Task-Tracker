import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

export function requestLogger(req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}
