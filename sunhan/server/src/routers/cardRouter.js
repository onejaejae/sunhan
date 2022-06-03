import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getCardBalance,
  createCard,
  deleteCard,
} from "../controllers/cardController";

const cardRouter = express.Router();

// 아동급식카드 잔액 조회
cardRouter.get("/", authJWT, getCardBalance);

// 아동급식카드 등록
cardRouter.post("/", authJWT, createCard);

// 아동급식카드 삭제
cardRouter.delete("/:id", authJWT, deleteCard);

export default cardRouter;
