import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
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

  // 어떤 커뮤니티 게시글의 댓글인지
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  // 어떤 감사의 편지의 댓글인지
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },

  content: {
    type: String,
    required: true,
  },

  // 어떤 댓글의 대댓글인지
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },

  // 대댓글이 있는 부모 댓글을 삭제 할 경우 true로 설정
  // isDeleted가 true라면 삭제된 댓글로 ui 구현
  isDeleted: {
    type: Boolean,
    default: false,
  },

  // 소속 대댓글 수
  commentCount: {
    type: Number,
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
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
