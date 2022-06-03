import jwt from "jsonwebtoken";
import { Container } from "typedi";
import { verify, sign, refresh, refreshVerify } from "../jwt";
import throwError from "../utils/throwError";
import authService from "../services/authService";
import redisClient from "../utils/redis";
import logger from "../config/logger";

const authServiceInstance = Container.get(authService);

export const naverLogin = async (req, res, next) => {
  try {
    let user;

    if (!req.headers.authorization) {
      return next(throwError(400, "header에 accessToken이 없습니다."));
    }

    const AccessToken = req.headers.authorization.split("Bearer ")[1];
    const result = await authServiceInstance.thirdPartyTokenApi(
      "https://openapi.naver.com/v1/nid/verify",
      AccessToken
    );

    if (!result) {
      return throwError(400, "accessToken이 유효하지 않습니다.");
    }

    const {
      data: {
        response: { email, id },
      },
    } = await authServiceInstance.thirdPartyTokenApi(
      "https://openapi.naver.com/v1/nid/me",
      AccessToken
    );

    user = await authServiceInstance.exUser(id, "naver");
    // 유저가 존재하지 않는다면
    if (!user) {
      user = await authServiceInstance.createUser(email, id, "naver");
    }

    // jwt 발급
    const accessToken = sign(user);
    const refreshToken = refresh();

    redisClient.set(user.id, refreshToken);

    res
      .status(200)
      .json({ message: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    next(error);
  }
};

export const kakaoLogin = async (req, res, next) => {
  let user;

  try {
    if (!req.headers.authorization) {
      return next(throwError(400, "header에 accessToken이 없습니다."));
    }

    const AccessToken = req.headers.authorization.split("Bearer ")[1];
    logger.info("Verify kakao AccessToken");
    const result = await authServiceInstance.thirdPartyTokenApi(
      "https://kapi.kakao.com/v1/user/access_token_info",
      AccessToken
    );

    if (!result) {
      return next(throwError(400, "accessToken이 유효하지 않습니다."));
    }

    logger.info("Creating User Info using Kakao API");
    const {
      data: {
        id,
        kakao_account: { email },
      },
    } = await authServiceInstance.thirdPartyTokenApi(
      "https://kapi.kakao.com/v2/user/me",
      AccessToken
    );

    logger.info("Finding Exist User");
    user = await authServiceInstance.exUser(id, "kakao");
    if (!user) {
      user = await authServiceInstance.createUser(email, id, "kakao");
    }

    logger.info("Generating JWT");
    // jwt 발급
    const accessToken = sign(user);
    const refreshToken = refresh();

    redisClient.set(user.id, refreshToken);

    logger.info(`GET /users/kakao 200 Response: "success: true"`);
    res
      .status(200)
      .json({ message: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    let user;

    if (!req.headers.authorization) {
      return next(throwError(400, "header에 accessToken이 없습니다."));
    }

    const AccessToken = req.headers.authorization.split("Bearer ")[1];
    logger.info("Verify google AccessToken");
    const result = await authServiceInstance.thirdPartyTokenApi(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${AccessToken}`
    );

    if (!result) {
      return next(throwError(400, "accessToken이 유효하지 않습니다."));
    }

    logger.info("Creating User Info using Kakao API");
    const {
      data: { email, id },
    } = await authServiceInstance.thirdPartyTokenApi(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      AccessToken
    );

    logger.info("Finding Exist User");
    user = await authServiceInstance.exUser(id, "google");
    if (!user) {
      user = await authServiceInstance.createUser(email, id, "google");
    }

    logger.info("Generating JWT");
    // jwt 발급
    const accessToken = sign(user);
    const refreshToken = refresh();

    redisClient.set(user.id, refreshToken);

    logger.info(`GET /users/google 200 Response: "success: true"`);
    res
      .status(200)
      .json({ message: "success", data: { accessToken, refreshToken } });
  } catch (error) {
    next(error);
  }
};

export const getRefresh = async (req, res, next) => {
  try {
    // access token과 refresh token의 존재 유무를 체크합니다.
    if (req.headers.authorization && req.headers.refresh) {
      const accessToken = req.headers.authorization.split("Bearer ")[1];
      const refreshToken = req.headers.refresh;

      logger.info("Verify AccessToken in /refresh");
      // access token 검증 -> expired여야 함.
      const accessResult = verify(accessToken);
      console.log(accessResult);

      // access token 디코딩하여 user의 정보를 가져옵니다.
      const decoded = jwt.decode(accessToken);

      // 디코딩 결과가 없으면 권한이 없음을 응답.
      if (decoded === null) {
        return next(throwError(401, "권한이 없습니다."));
      }

      logger.info("Verify RccessToken in /refresh");
      /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
      const refreshResult = await refreshVerify(refreshToken, decoded.id);

      // 재발급을 위해서는 access token이 만료되어 있어야합니다.
      if (
        accessResult.success === false &&
        accessResult.message === "jwt expired"
      ) {
        // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
        if (!refreshResult) {
          return next(throwError(401, "새로 로그인 해주세요."));
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          const newAccessToken = sign(decoded);

          logger.info(`GET /refresh 200 Response: "success: true"`);

          res.status(200).json({
            // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
            message: "success",
            data: {
              accessToken: newAccessToken,
              refreshToken,
            },
          });
        }
      } else {
        // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
        return next(throwError(400, "Access Token이 유효합니다."));
      }
    } else {
      // access token 또는 refresh token이 헤더에 없는 경우
      return next(throwError(400, "Access token, refresh token이 필요합니다."));
    }
  } catch (error) {
    next(error);
  }
};
