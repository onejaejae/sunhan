import express from "express";
import dotenv from "dotenv";
import "./config/db";
import logger from "./config/logger";

const startServer = async () => {
  const PORT = process.env.PORT || 4000;

  dotenv.config();
  const app = express();

  await require("./loaders/express").default(app);

  let isDisableKeepAlive = false;
  app.use(function (req, res, next) {
    if (isDisableKeepAlive) {
      res.set("Connection", "close");
    }
    next();
  });

  app.listen(process.env.PORT, () => {
    if (process.env.NODE_ENV === "production") {
      process.send("ready");
    }
    logger.info(`Server listening on ${PORT}`);
  });

  process.on("uncaughtException", function (err) {
    logger.error(`uncaughtException (Node is alive): ${err.message}`);
  });

  if (process.env.NODE_ENV === "production") {
    process.on("SIGINT", () => {
      isDisableKeepAlive = true;
      app.close(() => {
        logger.log("server closed");
        process.exit(0);
      });
    });
  }
};

startServer();
