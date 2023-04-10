const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

//회원가입
exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body; // front의 form으로부터
  try {
    const exUser = await User.findOne({ where: { email } });

    if (exUser) {
      return res.redirect("/join?error=exist");
    }

    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = (req, res, next) => {
  //localStrategy실행 /done이 여기로 넘어옴
  passport.authenticate("local", (authError, user, info) => {
    //서버 실패
    if (authError) {
      console.error(authError);
      return next(authError);
    }

    //로직 실패
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }

    //로그인 성공
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); //미들웨어 확장 패턴 (미들웨어 안에서 req, res, next를 사용하고 싶을 때 사용)
};

exports.logout = (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
};
