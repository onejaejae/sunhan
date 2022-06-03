import { createLogger, transports, format } from "winston";
import winstonDaily from "winston-daily-rotate-file";

const { combine, timestamp, colorize, simple, printf, label } = format;

const printFormat = printf(({ timestamp, label, level, message }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const printLogFormat = {
  file: combine(
    label({
      label: "sunhan",
    }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    printFormat
  ),
  console: combine(colorize(), simple()),
};

const opt = {
  //   file: new transports.File({
  //     filename: "access.log",
  //     dirname: "./logs",
  //     level: "info",
  //     format: printLogFormat.file,
  //   }),
  error: new winstonDaily({
    level: "error",
    datePattern: "YYYY-MM-DD",
    dirname: "./logs",
    filename: "%DATE%.error.log",
    maxSize: "50m",
    maxFiles: "30d",
    zippedArchive: true,
  }),
  // 모든 레벨 로그를 저장할 파일 설정
  debug: new winstonDaily({
    level: "debug",
    datePattern: "YYYY-MM-DD",
    dirname: "./logs",
    filename: "%DATE%.all.log",
    maxSize: "50m",
    maxFiles: "7d",
    zippedArchive: true,
  }),
  console: new transports.Console({
    level: "info",
    format: printLogFormat.console,
  }),
};

const logger = createLogger({
  format: printLogFormat.file,
  transports: [opt.error, opt.debug],
});

// 개발중일 때는 console에도 log를 출력해야하므로 file, console 두개를 생성
// 운영중일 때는 file만 필요
if (process.env.NODE_ENV !== "production") {
  logger.add(opt.console);
}

export default logger;
