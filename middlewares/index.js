const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { User, Domain } = require("../models");
const cors = require("cors");

exports.isLoggedIn = (req, res, next) => {
  // passport 통해서 로그인 했는지
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    // jwt의 검증이 끝나면 jwt의 내용물을 decoded에 넣는다
    res.locals.decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    return next();
  } catch (error) {
    //유효 기간 초과
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    // 토큰이 위조(검증 실패)
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

exports.apiLimiter = async (req, res, next) => {
  let user;
  if (res.locals.decoded) {
    user = await User.findOne({ where: { id: res.locals.decoded.id } });
  }
  rateLimit({
    windowMs: 60 * 1000, // 1분
    max: user?.type === "premium" ? 1000 : 10,
    handler(req, res) {
      res.status(this.statusCode).json({
        code: this.statusCode, // 기본값 429
        message: "1분에 열 번만 요청할 수 있습니다.",
      });
    },
  })(req, res, next);
};

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: "새로운 버전이 나왔습니다. 새로운 버전 이용 바랍니다",
  });
};

exports.corsWhenDomainMatches = async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: new URL(req.get("origin")).host }, //new URL => http 떼기 
  });
  if (domain) {
    //console.log("111");
    cors({
      origin: req.get("origin"),
      credentials: true, //쿠키 요청 받기 , origin: * 일때는 못 씀
    })(req, res, next);
  } else {
    //console.log("222");
    next();
  }
};
