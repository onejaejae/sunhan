import express from "express";
import authJWT from "../middlewares/authJWT";

import {
  getScraps,
  patchScrap,
  deleteScrap,
} from "../controllers/scrapController";

const scrapRouter = express.Router();

// 스크랩한 가맹점 가져오기
scrapRouter.get("/", authJWT, getScraps);
// 가맹점 스크랩
scrapRouter.patch("/:id", authJWT, patchScrap);
// 가맹점 스크랩 해제
scrapRouter.delete("/:id", authJWT, deleteScrap);

export default scrapRouter;
