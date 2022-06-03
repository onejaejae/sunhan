import reviewService from "../services/reviewService";
import { Container } from "typedi";
import logger from "../config/logger";
import throwError from "../utils/throwError";

const reviewServiceInstance = Container.get(reviewService);

export const getAllReviews = async (req, res, next) => {
  try {
    logger.info(`GET /reviews/:id"`);

    const { id } = req.params;
    const posts = await reviewServiceInstance.getAllReviews(id, req.query);

    logger.info(`GET /reviews/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: posts });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    logger.info(`POST /reviews"`);

    let filename = null;

    logger.info(`req.file : ${req.file}`);
    if (req.file) {
      filename = req.file.key;
    }

    const review = await reviewServiceInstance.createReview(
      req.id,
      req.body,
      filename
    );

    logger.info(`POST /reviews 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    logger.info(`PATCH /reviews/:id"`);

    let filename = null;
    if (req.file) {
      filename = req.file.key;
    }

    const { id: reviewId } = req.params;

    const post = await reviewServiceInstance.updateReview(
      reviewId,
      req.body,
      filename
    );

    logger.info(`PATCH /reviews/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

export const blockReview = async (req, res, next) => {
  try {
    logger.info(`PATCH /reviews/:id/block"`);

    const { id: reviewId } = req.params;
    await reviewServiceInstance.blockReview(req.id, reviewId);

    logger.info(`PATCH /reviews/:id/block 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    logger.info(`DELETE /reviews/:id"`);

    const { id: reviewId } = req.params;
    const { type } = req.query;

    await reviewServiceInstance.deleteReview(req.id, reviewId, type);

    logger.info(`DELETE /reviews/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
