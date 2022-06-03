import express from "express";
import authJWT from "../middlewares/authJWT";
import { upload } from "../middlewares/imageUpload";

import {
  getUser,
  getBlockUserList,
  getUserWritePosts,
  getUserWriteComments,
  getUserWriteReviews,
  setAddressInfo,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/userController";

const userRouter = express.Router();

// 유저 정보 가져오기
userRouter.get("/", authJWT, getUser);

// 유저 차단 목록 가져오기
userRouter.get("/block", authJWT, getBlockUserList);

// 유저가 쓴 커뮤니티 게시글 가져오기
userRouter.get("/posts", authJWT, getUserWritePosts);

// 유저가 쓴 댓글 가져오기
userRouter.get("/comments", authJWT, getUserWriteComments);

// 유저가 쓴 리뷰 가져오기
userRouter.get("/reviews", authJWT, getUserWriteReviews);

// 유저 주소 설정
userRouter.post("/address", authJWT, setAddressInfo);

// 유저 정보 업데이트
userRouter.patch("/", authJWT, upload.single("image"), updateUser);

// 유저 차단하기
userRouter.patch("/:id/block", authJWT, blockUser);

// 유저 차단 풀기
userRouter.patch("/:id/unblock", authJWT, unblockUser);

// 탈퇴하기
userRouter.delete("/", authJWT, deleteUser);

export default userRouter;
