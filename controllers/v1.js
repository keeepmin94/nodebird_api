const Domain = require("../models/domain");

exports.createToken = async (req, res) => {
  const { clientSecret } = req.body; //클라이언트와 req.body.clientSecret를 넣기로 협의한 상황
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: [{ model: User, attributes: ["id", "nick"] }],
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m", //유효기간
        issuer: "nodebird", //발급자
      }
    );
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

exports.tokenTest = async (req, res) => {
  res.json(res.locals.decoded);
};
