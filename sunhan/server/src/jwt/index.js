import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import logger from "../config/logger";
import redisClient from "../utils/redis";
import { promisify } from "util";

dotenv.config();

const { JWT_SECRET } = process.env;

export const sign = (user) => {
  const payload = {
    // access token에 들어갈 payload
    id: user.id,
    nickname: user.nickname,
  };

  return jwt.sign(payload, JWT_SECRET, {
    // secret으로 sign하여 발급하고 return
    algorithm: "HS256", // 암호화 알고리즘
    expiresIn: "30m", // 유효기간
  });
};

export const verify = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return {
      success: true,
      id: decoded.id,
    };
  } catch (err) {
    logger.error(`verify error ${err.message}`);

    return {
      success: false,
      message: err.message,
    };
  }
};

export const refresh = () => {
  return jwt.sign({}, JWT_SECRET, {
    // refresh token은 payload 없이 발급
    algorithm: "HS256",
    expiresIn: "365d",
  });
};

export const refreshVerify = async (refreshToken, userId) => {
  // refresh token 검증

  try {
    // refresh token 가져오기
    const getAsync = promisify(redisClient.get).bind(redisClient);
    const redisRefreshToken = await getAsync(userId);

    if (refreshToken === redisRefreshToken) {
      try {
        jwt.verify(refreshToken, JWT_SECRET);
        return true;
      } catch (err) {
        logger.error(`token error ${err.message}`);
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    logger.error(`catch error ${err.message}`);
    return false;
  }
};
