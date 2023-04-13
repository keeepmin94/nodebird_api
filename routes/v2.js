const express = require("express");
const { verifyToken, apiLimiter, corsWhenDomainMatches } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2");

const router = express.Router();

router.use(corsWhenDomainMatches);

// v1/token
router.post("/token", apiLimiter, createToken);
router.get("/test", verifyToken, apiLimiter, tokenTest);

// 내 게시글 가져오는 API
router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);
// 관련 해시태그 게시물 가져오는 API
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
