import postService from "../services/postService";
import { Container } from "typedi";
import logger from "../config/logger";
import throwError from "../utils/throwError";

const postServiceInstance = Container.get(postService);

export const getAllPosts = async (req, res, next) => {
  try {
    logger.info(`GET /posts"`);

    let { page } = req.query;
    page = page ? page : 0;

    const posts = await postServiceInstance.getAllPosts(page);

    logger.info(`GET /posts 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    logger.info(`GET /posts/:id"`);

    const { id: postId } = req.params;

    const post = await postServiceInstance.getPost(postId);

    logger.info(`GET /posts/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    logger.info(`POST /posts"`);

    const post = await postServiceInstance.createPost(req.id, req.body);

    logger.info(`POST /posts 200 Response: "success: true"`);
    return res.status(201).json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    logger.info(`PATCH /posts/:id"`);
    const { id: postId } = req.params;

    const post = await postServiceInstance.updatePost(postId, req.body);

    logger.info(`PATCH /posts/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

export const blockPost = async (req, res, next) => {
  try {
    logger.info(`PATCH /posts/:id/block"`);

    const { id: postId } = req.params;
    await postServiceInstance.blockPost(req.id, postId);

    logger.info(`PATCH /posts/:id/block 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    logger.info(`DELETE /posts/:id"`);
    const { id: postId } = req.params;

    await postServiceInstance.deletePost(req.id, postId);

    logger.info(`DELETE /posts/:id 200 Response: "success: true"`);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
