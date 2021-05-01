import { Request, Response } from "express"
import expressWinston, { BaseLoggerOptions } from "express-winston"
import winston from "winston"

export enum StatusLevel {
  Http = "http",
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
  Critical = "critical",
}

export const getLevel = (req: Request, res: Response): string => {
  switch (true) {
    // Log potential hacking attempts
    case res.statusCode === 401 || res.statusCode === 403:
      return StatusLevel.Critical
    // Log usage of deprecated API versions
    case req.path === "/v1":
      return StatusLevel.Warn
    case res.statusCode >= 500:
      return StatusLevel.Error
    case res.statusCode >= 400:
      return StatusLevel.Warn
    case res.statusCode >= 100:
      return StatusLevel.Info
    default:
      return StatusLevel.Http
  }
}

const baseLogger: BaseLoggerOptions = {
  msg:
    "HTTP: {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  level: (req, res) => getLevel(req, res),
}

export const debugLogger = expressWinston.logger({
  ...baseLogger,
  transports: [
    new winston.transports.Console({
      level: StatusLevel.Debug,
    }),
  ],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize()
  ),
  meta: false,
  metaField: null,
  colorize: true,
  statusLevels: false,
  ignoreRoute: () => process.env.NODE_ENV === "test",
})

export const requestLogger = expressWinston.logger({
  ...baseLogger,
  transports: [
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  meta: false,
  metaField: null,
  colorize: false,
  statusLevels: false,
  ignoreRoute: () => process.env.NODE_ENV === "test",
})

export const errorLogger = expressWinston.errorLogger({
  ...baseLogger,
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: StatusLevel.Error,
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  blacklistedMetaFields: ["exception"],
})
