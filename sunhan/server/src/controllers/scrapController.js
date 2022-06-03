import { Container } from "typedi";
import scrapService from "../services/scrapService";
import logger from "../config/logger";

const scrapServiceInstance = Container.get(scrapService);

export const getScraps = async (req, res, next) => {
  try {
    logger.info(`GET /scraps"`);

    let { type } = req.query;

    type = type ? type : "sunhan";
    const scraps = await scrapServiceInstance.getScraps(req.id, type);

    logger.info(`GET /scraps 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: scraps });
  } catch (error) {
    next(error);
  }
};

export const patchScrap = async (req, res, next) => {
  try {
    logger.info(`PATCH /scraps/:id"`);

    const { id: shopId } = req.params;
    const { type } = req.query;

    await scrapServiceInstance.createScrap(req.id, shopId, type);

    logger.info(`PATCH /scraps/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deleteScrap = async (req, res, next) => {
  try {
    logger.info(`DELETE /scraps/:id"`);

    const { id: shopId } = req.params;
    const { type } = req.query;

    await scrapServiceInstance.deleteScrap(req.id, shopId, type);

    logger.info(`DELETE /scraps/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
