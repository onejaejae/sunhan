import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import logger from "../config/logger";

import dataRouter from "../routers/dataRouter";
import postRouter from "../routers/postRouter";
import authRouter from "../routers/authRouter";
import scrapRouter from "../routers/scrapRouter";
import commentRouter from "../routers/commentRouter";
import reviewRouter from "../routers/reviewRouter";
import sunhanRouter from "../routers/sunhanRouter";
import userRouter from "../routers/userRouter";
import childrenRouter from "../routers/childrenRouter";
import cardRouter from "../routers/cardRouter";
import { generateFakeData } from "../faker";

export default (app) => {
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
    app.use(hpp());
    app.use(helmet());
  } else {
    app.use(morgan("dev"));
  }

  app.use(express.json());
  app.use("/img", express.static("uploads"));

  //faker
  // const generateFake = async () => {
  //   await generateFakeData(5000);
  // };
  // generateFake();

  app.use("/api/data", dataRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/scraps", scrapRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/sunhans", sunhanRouter);
  app.use("/api/users", userRouter);
  app.use("/api/children", childrenRouter);
  app.use("/api/cards", cardRouter);

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */

    if (err.name === "UnauthorizedError") {
      logger.error(
        `${res.req.method} ${res.req.url}  Response: "success: false, msg: ${err.message}"`
      );
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (process.env.NODE_ENV === "dev") {
      console.error(err);
    }
    logger.error(
      `${res.req.method} ${res.req.url} ${err.status} Response: "success: false, msg: ${err.message}"`
    );
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
