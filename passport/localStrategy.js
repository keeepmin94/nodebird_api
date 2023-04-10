const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    // LocalStrategy 등록
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
        passReqToCallback: false, // 이 옵션을 true로 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
      },
      async (email, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀먼보가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다.." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
