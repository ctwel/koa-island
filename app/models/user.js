const bcrypt = require("bcryptjs");
const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");
const { AuthFailed } = require("../../core/http-exception");
// 我们要引入 Sequelize 的库和实例

// 模型的方法
class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    // 查询数据中是否存在对应的传入的用户
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    // 当用户不存在
    if (!user) {
      throw new AuthFailed("账号不存在");
    }

    // 注意数据表中的密码是加密过后的，不能直接拿来与用户传入的密码进行对比
    const correct = bcrypt.compareSync(plainPassword, user.password);
    // 如果密码不一致
    if (!correct) {
      throw new AuthFailed("密码不正确");
    }
    return user;
  }

  // 根据 openid 查询用户
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    });
    return user;
  }

  // 新增用户
  static async registerByOpenid(openid) {
    return await User.create({
      openid
    });
  }
}

// 模型定义
// 第一个参数是模型的字段对象，第二个是对象，包含sequelize实例
User.init(
  {
    //设计数据库 user 表
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        const salt = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, salt);
        // 将 psw 放入数据库，model 属性操作
        this.setDataValue("password", psw);
      }
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true
    }
  },
  { sequelize, tableName: "user" }
);

module.exports = { User };
