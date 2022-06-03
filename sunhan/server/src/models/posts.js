import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
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

  content: {
    type: String,
    required: true,
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

const Post = mongoose.model("Post", postSchema);

export default Post;
