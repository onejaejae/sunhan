import { Container } from "typedi";
import sunhanService from "../services/sunhanService";
import logger from "../config/logger";

const sunhanServiceInstance = Container.get(sunhanService);

export const getAllSunhan = async (req, res, next) => {
  try {
    logger.info(`GET /sunhans"`);
    const sunhans = await sunhanServiceInstance.getAllSunhan(req.id, req.query);

    logger.info(`GET /sunhans 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: sunhans });
  } catch (error) {
    next(error);
  }
};

export const getAllSunhanGuest = async (req, res, next) => {
  try {
    logger.info(`GET /sunhans/guest"`);

    const sunhans = await sunhanServiceInstance.getAllSunhanGuest(req.query);

    logger.info(`GET /sunhans/guest 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: sunhans });
  } catch (error) {
    next(error);
  }
};

export const getSunhan = async (req, res, next) => {
  try {
    logger.info(`GET /sunhans/:id"`);

    const { id: sunhanId } = req.params;
    const sunhan = await sunhanServiceInstance.getSunhan(sunhanId);

    logger.info(`GET /sunhans/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: sunhan });
  } catch (error) {
    next(error);
  }
};

export const getSearchSunhan = async (req, res, next) => {
  try {
    logger.info(`GET /sunhans/search"`);

    const sunhanMenu = await sunhanServiceInstance.getSearchSunhan(
      req.id,
      req.query
    );

    logger.info(`GET /sunhans/search 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: sunhanMenu });
  } catch (error) {
    next(error);
  }
};

export const getSearchSunhanGuest = async (req, res, next) => {
  try {
    logger.info(`GET /sunhans/search/guest"`);

    const sunhanMenu = await sunhanServiceInstance.getSearchSunhanGuest(
      req.query
    );

    logger.info(`GET /sunhans/search/guest 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: sunhanMenu });
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const { category, detailCategory } =
      await sunhanServiceInstance.getAllCategory();
    return res
      .status(200)
      .json({ message: "success", data: { category, detailCategory } });
  } catch (error) {
    next(error);
  }
};
