const express = require("express");
const { verifyToken, deprecated } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v1");

const router = express.Router();

router.use(deprecated); //밑 라우터들 전부 적용

// v1/token
router.post("/token", createToken);
router.get("/test", verifyToken, tokenTest);

// 내 게시글 가져오는 API
router.get("/posts/my", verifyToken, getMyPosts);
// 관련 해시태그 게시물 가져오는 API
router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag);

module.exports = router;
