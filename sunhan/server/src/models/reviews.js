import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  writer: {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    nickname: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
  },

  // 어떤 선한영향력가게의 감사의 편지인지
  sunhanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sunhan",
  },

  childrenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
  },

  content: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
  },

  // 신고 수
  blockNumber: {
    type: Number,
    default: 0,
  },

  createAt: {
    type: String,
    required: true,
  },

  updateAt: {
    type: String,
    required: true,
  },

  commentCount: {
    type: Number,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
