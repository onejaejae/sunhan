import mongoose from "mongoose";
import { reviewSchema } from "./reviews";

export const childCardShopSchema = new mongoose.Schema({
  // 가맹점명
  name: {
    type: String,
  },

  // 가맹점유형코드
  code: {
    type: Number,
  },

  // 시도명
  cityName: {
    type: String,
  },

  // 시군구명
  fullCityName: {
    type: String,
  },

  // 시군구코드
  fullCityNameCode: {
    type: Number,
  },

  // 소재지도로명주소
  address: {
    type: String,
  },

  // 위도
  lat: {
    type: Number,
  },

  // 경도
  lng: {
    type: Number,
  },

  location: {
    type: { type: String },
    coordinates: [{ type: Number }],
  },

  // 전화번호
  phoneNumber: {
    type: String,
  },

  // 평일운영시작시각
  weekdayStartTime: {
    type: String,
  },

  // 	평일운영종료시각
  weekdayEndTime: {
    type: String,
  },

  // 주말운영시작시각
  weekendStartTime: {
    type: String,
  },

  // 주말운영종료시각
  weekendEndTime: {
    type: String,
  },

  // 공휴일운영시작시각
  holydayStartTime: {
    type: String,
  },

  // 공휴일운영종료시각
  holydayEndTime: {
    type: String,
  },

  // 카테고리
  category: {
    type: String,
    default: "",
  },

  // 상세 카테고리
  detailCategory: {
    type: String,
  },

  reviews: [reviewSchema],
});

childCardShopSchema.index({ location: "2dsphere" });

const Child = mongoose.model("Child", childCardShopSchema);

export default Child;
