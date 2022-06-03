import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  blockPost,
  deletePost,
} from "../controllers/postController";

const postRouter = express.Router();

// 모든 커뮤니티 게시글 가져오기
postRouter.get("/", getAllPosts);
// 특정 게시글 가져오기
postRouter.get("/:id", getPost);

// 게시글 만들기
postRouter.post("/", authJWT, createPost);

// 게시글 수정하기
postRouter.patch("/:id", authJWT, updatePost);
// 특정 게시글 신고하기
postRouter.patch("/:id/block", authJWT, blockPost);

// 게시글 삭제하기
postRouter.delete("/:id", authJWT, deletePost);

export default postRouter;
