import express from "express";

import {
  createSunhan,
  createChild,
  naverSearchApi,
  kakaoSearchApi,
} from "../controllers/dataController";

const dataRouter = express.Router();

// kakao 키워드로 장소 검색하기 api를 통해서 카테고리 정보 받아오기
dataRouter.get("/kakao/search", kakaoSearchApi);

// 선한영향력가게 가맹점 정보 db에 저장
dataRouter.post("/sunhan", createSunhan);

// 아동급식카드 가맹점 정보 db에 저장
dataRouter.post("/child", createChild);

dataRouter.post("/naver/search", naverSearchApi);

export default dataRouter;
