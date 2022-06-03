import { Service } from "typedi";
import User from "../models/users";
import Review from "../models/reviews";
import Post from "../models/posts";
import Sunhan from "../models/sunhanShop";
import Comment from "../models/comments";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import redisClient from "../utils/redis";
import { isValidObjectId, Types } from "mongoose";
import logger from "../config/logger";

@Service()
export default class userService {
  constructor() {
    this.user = User;
    this.review = Review;
    this.post = Post;
    this.comment = Comment;
    this.sunhan = Sunhan;
  }

  async getUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding User in getUser");
      const user = await this.user.findById(userId, {
        email: 1,
        nickname: 1,
        avatarUrl: 1,
      });

      return user;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getBlockUserList(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding Block Users List in getBlockUserList");
      const user = await this.user
        .findById(userId, {
          blockUsers: 1,
        })
        .populate("blockUsers");

      return user;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getUserWritePosts(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding Posts that user wrote in getUserWritePosts");
      const posts = await this.user
        .findById(userId, {
          address: 0,
          nickname: 0,
          avatarUrl: 0,
          email: 0,
          scrapSunhan: 0,
          scrapChild: 0,
          blockPosts: 0,
          blockReviews: 0,
          blockComments: 0,
          naverId: 0,
          googleId: 0,
          kakaoId: 0,
          blockUsers: 0,
          childCard: 0,
          __v: 0,
          writeReviews: 0,
          writeComments: 0,
          writePosts: { $slice: [page * 10, page * 10 + 10] },
        })
        .populate("writePosts");

      return posts;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getUserWriteComments(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding Comments that user wrote in getUserWriteComments");
      const comments = await this.user
        .findById(userId, { writeComments: 1 })
        .populate("writeComments");

      // ObjectId to String
      let ids = comments.writeComments.map((comment) => {
        return Types.ObjectId(comment.postId).toString();
      });

      // 중복제거
      ids = Array.from(new Set(ids));
      // String to ObjectId
      ids = ids.map((id) => new Types.ObjectId(id));

      logger.info(
        "Finding Post that user wrote Comments in getUserWriteComments"
      );
      // $in 순서 보장하지 않으므로 aggregate를 통해 순서보장
      const posts = await this.post.aggregate([
        { $match: { _id: { $in: ids } } },
        { $addFields: { __order: { $indexOfArray: [ids, "$_id"] } } },
        { $sort: { __order: 1 } },
        { $skip: page * 10 },
        { $limit: 10 },
        { $project: { __v: 0, __order: 0, blockNumber: 0 } },
      ]);

      return posts;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getUserWriteReviews(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding Reviews that user wrote in getUserWriteReviews");
      const reviews = await this.user
        .findById(userId, {
          address: 0,
          nickname: 0,
          avatarUrl: 0,
          email: 0,
          scrapSunhan: 0,
          scrapChild: 0,
          blockPosts: 0,
          blockReviews: 0,
          blockComments: 0,
          naverId: 0,
          googleId: 0,
          blockUsers: 0,
          childCard: 0,
          __v: 0,
          writePosts: 0,
          writeComments: 0,
          writeReviews: { $slice: [page * 10, page * 10 + 10] },
        })
        .populate("writeReviews");

      return reviews;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async setAddressInfo(userId, addressDTO) {
    try {
      logger.info("Setting adderss in setAddressInfo");
      await this.user.findByIdAndUpdate(userId, { address: addressDTO });
    } catch (error) {
      throw serviceError(error);
    }
  }

  async updateUser(userId, updateUserDTO, avatarUrl) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Updating User data in updateUser");
      if (avatarUrl) {
        updateUserDTO.avatarUrl = avatarUrl.split("/")[1];

        // avatarUrl, nickname 모두 변경하는 경우
        if (updateUserDTO.nickname) {
          await Promise.all([
            this.user.findByIdAndUpdate(userId, updateUserDTO),
            this.sunhan.updateMany(
              {},
              {
                $set: {
                  "reviews.$[element].writer.avatarUrl":
                    updateUserDTO.avatarUrl,
                  "reviews.$[element].writer.nickname": updateUserDTO.nickname,
                },
              },
              { arrayFilters: [{ "element.writer._id": userId }] }
            ),
            this.comment.updateMany(
              { "writer._id": userId },
              {
                $set: {
                  "writer.avatarUrl": updateUserDTO.avatarUrl,
                  "writer.nickname": updateUserDTO.nickname,
                },
              }
            ),
            this.post.updateMany(
              { "writer._id": userId },
              {
                $set: {
                  "writer.avatarUrl": updateUserDTO.avatarUrl,
                  "writer.nickname": updateUserDTO.nickname,
                },
              }
            ),
            this.review.updateMany(
              { "writer._id": userId },
              {
                $set: {
                  "writer.avatarUrl": updateUserDTO.avatarUrl,
                  "writer.nickname": updateUserDTO.nickname,
                },
              }
            ),
          ]);
          return;
        }

        // avatarUrl 변경하는 경우
        await Promise.all([
          this.user.findByIdAndUpdate(userId, updateUserDTO),
          this.sunhan.updateMany(
            {},
            {
              $set: {
                "reviews.$[element].writer.avatarUrl": updateUserDTO.avatarUrl,
              },
            },
            { arrayFilters: [{ "element.writer._id": userId }] }
          ),
          this.comment.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.avatarUrl": updateUserDTO.avatarUrl,
              },
            }
          ),
          this.post.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.avatarUrl": updateUserDTO.avatarUrl,
              },
            }
          ),
          this.review.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.avatarUrl": updateUserDTO.avatarUrl,
              },
            }
          ),
        ]);
        return;
      }
      // nickname만 변경하는 경우
      else {
        await Promise.all([
          this.user.findByIdAndUpdate(userId, updateUserDTO),
          this.sunhan.updateMany(
            {},
            {
              $set: {
                "reviews.$[element].writer.nickname": updateUserDTO.nickname,
              },
            },
            { arrayFilters: [{ "element.writer._id": userId }] }
          ),
          this.comment.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.nickname": updateUserDTO.nickname,
              },
            }
          ),
          this.post.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.nickname": updateUserDTO.nickname,
              },
            }
          ),
          this.review.updateMany(
            { "writer._id": userId },
            {
              $set: {
                "writer.nickname": updateUserDTO.nickname,
              },
            }
          ),
        ]);
      }
    } catch (error) {
      throw serviceError(error);
    }
  }

  async blockUser(userId, blockUserId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(blockUserId)) {
        throw throwError(400, "blockUserId가 유효하지 않습니다.");
      }

      logger.info("Finding Block User in blockUser");
      const blockUser = await this.user.findById(blockUserId);

      logger.info("Block User in blockUser");
      await this.user.findByIdAndUpdate(userId, {
        $addToSet: { blockUsers: blockUser },
      });
    } catch (error) {
      throw serviceError(error);
    }
  }

  async unblockUser(userId, blockUserId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(blockUserId)) {
        throw throwError(400, "blockUserId가 유효하지 않습니다.");
      }

      logger.info("Unblock User in unblockUser");
      await this.user.findByIdAndUpdate(userId, {
        $pull: { blockUsers: { _id: blockUserId } },
      });
    } catch (error) {
      throw serviceError(error);
    }
  }

  async deleteUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Delete User in deleteUser");
      await Promise.all([
        this.user.findByIdAndDelete(userId),
        this.review.updateMany(
          { "writer._id": userId },
          {
            $set: {
              "writer.nickname": "탈퇴 회원",
              "writer.avatarUrl": "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
            },
          }
        ),
        this.post.updateMany(
          { "writer._id": userId },
          {
            $set: {
              "writer.nickname": "탈퇴 회원",
              "writer.avatarUrl": "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
            },
          }
        ),
        this.comment.updateMany(
          { "writer._id": userId },
          {
            $set: {
              "writer.nickname": "탈퇴 회원",
              "writer.avatarUrl": "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
            },
          }
        ),
      ]);

      redisClient.del(userId);
    } catch (error) {
      throw serviceError(error);
    }
  }
}
