import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getSunhan,
  getSearchSunhan,
  getSearchSunhanGuest,
  getAllSunhan,
  getAllSunhanGuest,
  getAllCategory,
} from "../controllers/sunhanController";

const sunhanRouter = express.Router();

// TODO
// 1. 선한영향력가게 범주화 진행 후 카테고리 관련 API
// 2. 이름 검색 API
// 3. 아동급식카드 가맹점 API 제작

// 카테고리별 선한 영향력 가게 가져오기
sunhanRouter.get("/", authJWT, getAllSunhan);

// 비회원용 카테고리별 선한 영향력 가게 가져오기
sunhanRouter.get("/guest", getAllSunhanGuest);

// 검색 api
sunhanRouter.get("/search", authJWT, getSearchSunhan);

// 비회원용 검색 api
sunhanRouter.get("/search/guest", getSearchSunhanGuest);

// 모든 카테고리 가져오기
sunhanRouter.get("/category", getAllCategory);

// 특정 선한 영향력 가게 가져오기
sunhanRouter.get("/:id", getSunhan);

export default sunhanRouter;
