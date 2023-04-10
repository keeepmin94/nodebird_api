const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //메모리에 저장되는데 user전체를 저장하면 용량이 너무 큼 -> 공유된 메모리에 저장되는걸로 나중에 바꿈
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        }, //팔로잉
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        }, //팔로워
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
