import express from "express";
import authJWT from "../middlewares/authJWT";
import { upload } from "../middlewares/imageUpload";

import {
  getAllReviews,
  createReview,
  updateReview,
  blockReview,
  deleteReview,
} from "../controllers/reviewController";

const reviewRouter = express.Router();

// 모든 감사의 편지 가져오기
reviewRouter.get("/:id", getAllReviews);

// 감사의 편지 작성하기
reviewRouter.post("/", authJWT, upload.single("image"), createReview);

// 감사의 편지 수정하기
reviewRouter.patch("/:id", authJWT, upload.single("image"), updateReview);

// 감사의 편지 신고하기
reviewRouter.patch("/:id/block", authJWT, blockReview);

// 감사의 편지 삭제하기
reviewRouter.delete("/:id", authJWT, deleteReview);

export default reviewRouter;
