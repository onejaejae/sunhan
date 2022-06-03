import { Service } from "typedi";
import Child from "../models/childCardShop";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import mongoose from "mongoose";
import logger from "../config/logger";

@Service()
export default class childrenService {
  constructor() {
    this.child = Child;
    this.user = User;
  }

  async getAllChildrenShop(userId, query) {
    try {
      let { page, sort } = query;
      page = page ? page : 0;

      const variable = sort === "name" ? { name: 1 } : {};

      if (!mongoose.isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding User in getAllChildrenShop");
      const user = await this.user.findById(userId);

      logger.info("Finding childrenShops in getAllChildrenShop");
      const childrenShops = await this.child
        .find(
          {
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [user.address.lng, user.address.lat],
                },
                $minDistance: 0,
                $maxDistance: 5000,
              },
            },
          },
          {
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
            reviews: 0,
          }
        )
        .skip(page * 10)
        .limit(10)
        .sort(variable);

      return childrenShops;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getAllChildrenShopGuest(query) {
    try {
      let { page, sort, lat, lng } = query;
      page = page ? page : 0;

      if (!lat || !lng) {
        lat = 37.300485;
        lng = 127.035833;
      }

      const variable = sort === "name" ? { name: 1 } : {};

      logger.info("Finding childrenShops in getAllChildrenShopGuest");
      const childrenShops = await this.child
        .find(
          {
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
                $minDistance: 0,
                $maxDistance: 5000,
              },
            },
          },
          {
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
            reviews: 0,
          }
        )
        .skip(page * 10)
        .limit(10)
        .sort(variable);

      return childrenShops;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getChildrenShop(childrenShopId) {
    try {
      if (!mongoose.isValidObjectId(childrenShopId)) {
        throw throwError(400, "childrenShopId가 유효하지 않습니다.");
      }
      console.log(childrenShopId);
      logger.info("Finding childrenShop in getChildrenShop");

      let childrenShop;
      const child = await this.child.findById(childrenShopId, {
        location: 0,
        __v: 0,
        code: 0,
        cityName: 0,
        fullCityName: 0,
        fullCityNameCode: 0,
        lat: 0,
        lng: 0,
        detailCategory: 0,
      });

      if (child.reviews.length > 0) {
        childrenShop = await this.child.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(childrenShopId) } },
          { $unwind: "$reviews" },
          { $sort: { "reviews._id": -1 } },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              address: { $first: "$address" },
              phoneNumber: { $first: "$phoneNumber" },
              weekdayStartTime: { $first: "$weekdayStartTime" },
              weekdayEndTime: { $first: "$weekdayEndTime" },
              weekendStartTime: { $first: "$weekendStartTime" },
              weekendEndTime: { $first: "$weekendEndTime" },
              holydayStartTime: { $first: "$holydayStartTime" },
              holydayEndTime: { $first: "$holydayEndTime" },
              category: { $first: "$category" },
              reviews: { $push: "$reviews" },
            },
          },
        ]);

        childrenShop = childrenShop[0];
      } else {
        childrenShop = child;
      }

      return childrenShop;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getSearchChildrenShop(userId, query) {
    try {
      const { name, page } = query;

      if (!mongoose.isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      logger.info("Finding User in getSearchChildrenShop");
      const user = await this.user.findById(userId);

      logger.info("Finding childrenShops in getSearchChildrenShop");
      const childrenShops = await this.child
        .find(
          {
            name: { $regex: name, $options: "i" },
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [user.address.lng, user.address.lat],
                },
                $minDistance: 0,
                $maxDistance: 3000,
              },
            },
          },
          {
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
            reviews: 0,
          }
        )
        .skip(page * 10)
        .limit(10);

      return childrenShops;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getSearchChildrenShopGuest(query) {
    try {
      let { name, page, lat, lng } = query;
      if (!lat || !lng) {
        lat = 37.300485;
        lng = 127.035833;
      }

      logger.info("Finding childrenShops in getSearchChildrenShopGuest");
      const childrenShops = await this.child
        .find(
          {
            name: { $regex: name, $options: "i" },
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
                $minDistance: 0,
                $maxDistance: 3000,
              },
            },
          },
          {
            __v: 0,
            location: 0,
            fullCityNameCode: 0,
            code: 0,
            cityName: 0,
            fullCityName: 0,
            lat: 0,
            lng: 0,
            reviews: 0,
          }
        )
        .skip(page * 10)
        .limit(10);

      return childrenShops;
    } catch (error) {
      throw serviceError(error);
    }
  }

  async getAllCategory() {
    try {
      const category = await this.child.find().distinct("category");
      const detailCategory = await this.child.find().distinct("detailCategory");
      return { category, detailCategory };
    } catch (error) {
      throw serviceError(error);
    }
  }
}
