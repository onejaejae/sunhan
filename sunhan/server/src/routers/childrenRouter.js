import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getAllChildrenShop,
  getAllChildrenShopGuest,
  getChildrenShop,
  getSearchChildrenShop,
  getSearchChildrenShopGuest,
  getAllCategory,
} from "../controllers/childrenController";

const childrenRouter = express.Router();

// 카테고리별 아동급식카드 가맹점 가져오기
childrenRouter.get("/", authJWT, getAllChildrenShop);

// 비회원용 카테고리별 아동급식카드 가맹점 가져오기
childrenRouter.get("/guest", getAllChildrenShopGuest);

// 검색 api
childrenRouter.get("/search", authJWT, getSearchChildrenShop);

// 비회원용 검색 api
childrenRouter.get("/search/guest", getSearchChildrenShopGuest);

// 모든 카테고리 가져오기
childrenRouter.get("/category", getAllCategory);

// 특정 아동급식카드 가맹점 가져오기
childrenRouter.get("/:id", getChildrenShop);

export default childrenRouter;
