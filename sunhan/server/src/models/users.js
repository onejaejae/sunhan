import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: false,
    unique: 1,
  },

  avatarUrl: {
    type: String,
    default: "f0e3b6e9-d6fa-4867-a966-7fe689f9c3c2.jpg",
  },

  address: {
    lat: { type: Number, default: 37.300485 },
    lng: { type: Number, default: 127.035833 },
  },

  email: {
    type: String,
    required: true,
  },

  // ref라는 옵션에 참조할 모델(collection)명을 삽입.
  // 선한영향력가게 가맹점 스크랩
  scrapSunhan: [{ type: mongoose.Types.ObjectId, ref: "Sunhan" }],
  // 아동급식카드 가맹점 스크랩
  scrapChild: [{ type: mongoose.Types.ObjectId, ref: "Child" }],
  // 작성한 감사의 편지
  writeReviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  // 작성한 커뮤니티 게시글
  writePosts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  // 작성한 댓글
  writeComments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  // 커뮤니티 게시글 신고
  blockPosts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  // 감사의 편지 신고
  blockReviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  // 댓글 신고
  blockComments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  // 유저 신고
  blockUsers: [
    {
      _id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
      },
      nickname: {
        type: String,
        required: true,
      },
    },
  ],

  // 아동급식카드
  childCard: [
    {
      // 농협 api 핀-어카운트
      // 핀-어카운트를 이용해 계속 잔액 조회 가능
      FinAcno: String,

      name: String,

      accountNumber: Number,

      // 잔액
      balance: Number,
    },
  ],

  kakaoId: Number,

  googleId: Number,

  naverId: String,
});

const User = mongoose.model("User", userSchema);

export default User;
