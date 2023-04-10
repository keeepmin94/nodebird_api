const jwt = require("jsonwebtoken");

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
    if(error.name === 'TokenExpiredError'){
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      })
    }
    // 토큰이 위조(검증 실패)
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.'
    })
  }
};
