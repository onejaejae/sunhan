import express from "express";

import {
  naverLogin,
  kakaoLogin,
  googleLogin,
  getRefresh,
} from "../controllers/authController";

const authRouter = express.Router();

// 네이버 로그인
authRouter.get("/naver", naverLogin);
// 카카오 로그인
authRouter.get("/kakao", kakaoLogin);
// 구글 로그인
authRouter.get("/google", googleLogin);

authRouter.get("/refresh", getRefresh);

export default authRouter;
