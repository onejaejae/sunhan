import { Container } from "typedi";
import userService from "../services/userService";
import logger from "../config/logger";

const userServiceInstance = Container.get(userService);

export const getUser = async (req, res, next) => {
  try {
    logger.info(`GET /users`);

    const user = await userServiceInstance.getUser(req.id);

    logger.info(`GET /users 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export const getBlockUserList = async (req, res, next) => {
  try {
    logger.info(`GET /users/block`);

    const userBlockList = await userServiceInstance.getBlockUserList(req.id);

    logger.info(`GET /users/block 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: userBlockList });
  } catch (error) {
    next(error);
  }
};

export const getUserWritePosts = async (req, res, next) => {
  try {
    logger.info(`GET /users/posts`);

    let { page } = req.query;
    page = page ? page : 0;

    const posts = await userServiceInstance.getUserWritePosts(req.id, page);

    logger.info(`GET /users/posts 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: posts });
  } catch (error) {
    next(error);
  }
};

export const getUserWriteComments = async (req, res, next) => {
  try {
    logger.info(`GET /users/comments`);

    let { page } = req.query;

    page = page ? page : 0;
    const comments = await userServiceInstance.getUserWriteComments(
      req.id,
      page
    );

    logger.info(`GET /users/comments 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: comments });
  } catch (error) {
    next(error);
  }
};

export const getUserWriteReviews = async (req, res, next) => {
  try {
    logger.info(`GET /users/reviews`);

    let { page } = req.query;
    page = page ? page : 0;

    const reviews = await userServiceInstance.getUserWriteReviews(req.id, page);

    logger.info(`GET /users/reviews 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: reviews });
  } catch (error) {
    next(error);
  }
};

export const setAddressInfo = async (req, res, next) => {
  try {
    logger.info(`POST /users/address`);

    await userServiceInstance.setAddressInfo(req.id, req.body);

    logger.info(`POST /users/address 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    logger.info(`PATCH /users`);

    let filename = null;
    if (req.file) {
      filename = req.file.key;
    }

    await userServiceInstance.updateUser(req.id, req.body, filename);

    logger.info(`PATCH /users 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    logger.info(`PATCH /users/:id/block`);

    const { id: blockUserId } = req.params;

    await userServiceInstance.blockUser(req.id, blockUserId);

    logger.info(`PATCH /users/:id/block 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    logger.info(`PATCH /users/:id/unblock`);

    const { id: blockUserId } = req.params;

    await userServiceInstance.unblockUser(req.id, blockUserId);

    logger.info(`PATCH /users/:id/unblock 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    logger.info(`DELETE /users`);
    await userServiceInstance.deleteUser(req.id);

    logger.info(`DELETE /users 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
