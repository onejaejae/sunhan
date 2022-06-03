import { Service } from "typedi";
import axios from "axios";
import User from "../models/users";
import serviceError from "../utils/serviceError";
import logger from "../config/logger";

@Service()
export default class authService {
  constructor() {
    this.user = User;
  }

  async thirdPartyTokenApi(baseUrl, accessToken = null) {
    try {
      let data;

      if (accessToken) {
        data = await axios.get(baseUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        data = await axios.get(baseUrl);
      }

      return data;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async exUser(id, type) {
    try {
      let exUser;

      switch (type) {
        case "naver":
          exUser = await this.user.findOne({ naverId: id });
          break;
        case "kakao":
          exUser = await this.user.findOne({ kakaoId: id });
          break;
        case "google":
          exUser = await this.user.findOne({ googleId: id });
          break;
      }

      return exUser;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async createUser(email, id, type) {
    try {
      let user;

      switch (type) {
        case "kakao":
          user = await this.user.create({
            email,
            kakaoId: id,
            nickname: `선한${parseInt(Math.random() * 100000)}`,
          });
          break;

        case "naver":
          user = await this.user.create({
            email,
            naverId: id,
            nickname: `선한${parseInt(Math.random() * 100000)}`,
          });
          break;

        case "google":
          user = await this.user.create({
            email,
            googleId: id,
            nickname: `선한${parseInt(Math.random() * 100000)}`,
          });
          break;
      }

      return user;
    } catch (error) {
      throw serviceError(error);
    }
  }
}
