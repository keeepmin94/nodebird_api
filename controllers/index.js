const Domain = require("../models/domain");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

exports.renderLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id || null },
      include: [{ model: Domain }], //여기서 하기 싫으면 passport/index의 deserializeUser에서 가져오자
    });
    res.render("login", {
      user,
      domains: user?.Domains,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.createDomain = async (req, res, next) => {
  try {
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(),
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
