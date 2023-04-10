const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  // Table 정보들 입력
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User", //js에서 이름
        tableName: "users", //Db 이름
        paranoid: true, // deleteAt 유저 삭제일 // soft delete
        charset: "utf8", // 이모티콘 저장 하려면 -> utf8mb4
        collate: "utf8_general_ci",
      }
    );
  }

  //Table 관계들 입력
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      //팔로워
      foreignKey: "followingId",
      as: "Followers", //둘다 유저라 헷갈릴까봐
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      //팔로잉
      foreignKey: "followerId",
      as: "Followings", //둘다 유저라 헷갈릴까봐
      through: "Follow",
    });
    db.User.hasMany(db.Domain);
  }
}

module.exports = User;
