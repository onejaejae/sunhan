import { Container } from "typedi";
import childrenService from "../services/childrenService";
import throwError from "../utils/throwError";
import logger from "../config/logger";

const childrenServiceInstance = Container.get(childrenService);

export const getAllChildrenShop = async (req, res, next) => {
  try {
    logger.info(`GET /children"`);

    const childrenShops = await childrenServiceInstance.getAllChildrenShop(
      req.id,
      req.query
    );

    logger.info(`GET /children 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    next(error);
  }
};

export const getAllChildrenShopGuest = async (req, res, next) => {
  try {
    logger.info(`GET /children/guest"`);

    const childrenShops = await childrenServiceInstance.getAllChildrenShopGuest(
      req.query
    );

    logger.info(`GET /children/guest 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    next(error);
  }
};

export const getChildrenShop = async (req, res, next) => {
  try {
    logger.info(`GET /children/:id"`);

    const { id: childrenShopId } = req.params;

    const childrenShop = await childrenServiceInstance.getChildrenShop(
      childrenShopId
    );

    if (!childrenShop) {
      throw throwError(400, "해당하는 childrenShop이 존재하지 않습니다.");
    }

    logger.info(`GET /children/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: childrenShop });
  } catch (error) {
    next(error);
  }
};

export const getSearchChildrenShop = async (req, res, next) => {
  try {
    logger.info(`GET /children/search"`);

    const childrenShops = await childrenServiceInstance.getSearchChildrenShop(
      req.id,
      req.query
    );

    logger.info(`GET /children/search 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    next(error);
  }
};

export const getSearchChildrenShopGuest = async (req, res, next) => {
  try {
    logger.info(`GET /children/search/guest"`);

    const childrenShops =
      await childrenServiceInstance.getSearchChildrenShopGuest(req.query);

    logger.info(`GET /children/search/guest 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: childrenShops });
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const { category, detailCategory } =
      await childrenServiceInstance.getAllCategory();

    return res
      .status(200)
      .json({ message: "success", data: { category, detailCategory } });
  } catch (error) {
    next(error);
  }
};
