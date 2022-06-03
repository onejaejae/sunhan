import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../config/logger";

dotenv.config();

if (!process.env.DB_HOST_TEST) logger.error(`DB_HOST_TEST is required!!!`);
if (!process.env.DB_HOST) logger.error(`DB_HOST is required!!!`);

if (process.env.NODE_ENV === "dev") {
  mongoose
    .connect(process.env.DB_HOST_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => logger.info("MongoDB Connected!"))
    .catch((err) => logger.error(err.message));
} else {
  mongoose
    .connect(process.env.DB_HOST_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => logger.info("MongoDB Connected!"))
    .catch((err) => logger.error(err.message));
}
