const express = require("express");
const { verifyToken } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostByHashtag,
} = require("../controllers/v1");

const router = express.Router();

// v1/token
router.post("/token", createToken);
router.get("/test", verifyToken, tokenTest);

// 내 게시글 가져오는 API
router.get("/posts/my", verifyToken, getMyPosts);
// 관련 해시태그 게시물 가져오는 API
router.get("/posts/hashtag/:title", verifyToken, getPostByHashtag);

module.exports = router;
