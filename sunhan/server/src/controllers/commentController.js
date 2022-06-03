import { Container } from "typedi";
import logger from "../config/logger";
import commentService from "../services/commentService";

const commentServiceInstance = Container.get(commentService);

export const getAllPostComments = async (req, res, next) => {
  try {
    logger.info("GET /comments/:id/post");

    let { page } = req.query;
    const { id: postId } = req.params;

    page = page ? page : 0;
    const comments = await commentServiceInstance.getAllPostComments(
      postId,
      page
    );

    logger.info(`GET /comments/:id/post 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: comments });
  } catch (error) {
    next(error);
  }
};

export const createPostParentComment = async (req, res, next) => {
  try {
    logger.info("POST /comments/post/parent");

    const { postId } = req.body;

    const comment = await commentServiceInstance.createPostParentComment(
      req.id,
      postId,
      req.body
    );

    logger.info(`POST /comments/post/parent 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

export const createPostComment = async (req, res, next) => {
  try {
    logger.info("POST /comments/post");

    const { postId, parentId } = req.body;

    const comment = await commentServiceInstance.createPostComment(
      req.id,
      postId,
      parentId,
      req.body
    );

    logger.info(`POST /comments/post 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    logger.info("PATCH /comments/:id");

    const { id: commentId } = req.params;

    const comment = await commentServiceInstance.updateComment(
      commentId,
      req.body
    );

    logger.info(`PATCH /comments/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

export const blockComment = async (req, res, next) => {
  try {
    logger.info("PATCH /comments/:id/block");

    const { id: commentId } = req.params;

    await commentServiceInstance.blockComment(req.id, commentId);

    logger.info(`PATCH /comments/:id/block 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deleteParentPostComment = async (req, res, next) => {
  try {
    logger.info("PUT /comments/:id/post/parent");

    const { id: commentId } = req.params;
    await commentServiceInstance.deleteParentPostComment(req.id, commentId);

    logger.info(`PUT /comments/:id/post/parent 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deletePostComment = async (req, res, next) => {
  try {
    logger.info("DELETE /comments/:id/post");

    const { id: commentId } = req.params;

    await commentServiceInstance.deletePostComment(req.id, commentId);

    logger.info(`DELETE /comments/:id/post 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
