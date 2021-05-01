import { Request, Response } from "express"
import expressWinston, { BaseLoggerOptions } from "express-winston"
import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

export enum StatusLevel {
  Http = "http",
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
  Critical = "critical",
}

// Setup
const baseLoggerOptions: BaseLoggerOptions = {
  msg:
    "HTTP: {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  level: (req, res) => getLevel(req, res),
}

const baseRotateFileOptions = {
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
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

export const debugLogger = expressWinston.logger({
  ...baseLoggerOptions,
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
  ...baseLoggerOptions,
  transports: [
    new DailyRotateFile({
      ...baseRotateFileOptions,
      dirname: "logs/all/",
      filename: "all-%DATE%.log",
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
  ...baseLoggerOptions,
  transports: [
    new DailyRotateFile({
      ...baseRotateFileOptions,
      dirname: "logs/error/",
      filename: "error-%DATE%.log",
      level: StatusLevel.Error,
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  blacklistedMetaFields: ["exception"],
})
