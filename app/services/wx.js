// NodeJS 内置的工具，格式化
const util = require("util");
const axios = require("axios");
const { User } = require("../models/user");
const { generateToken } = require("../../core/util");
const { Auth } = require("../../middlewares/auth");
class WXManager {
  static async codeTOToken(code) {
    const url = util.format(
      global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code
    );
    const result = await axios.get(url);
    // 每个 axios 返回结果都有一个 status
    if (result.status !== 200) {
      throw new global.errs.AuthFailed("openid获取失败");
    }
    // status 不是 200，说明微信服务器返回给了我们一个结果
    // 返回结果不一定代表 code 合法的，还需进一步判断
    const errcode = result.data.errcode;
    const errmsg = result.data.errmsg;
    if (errcode) {
      // code不合法
      throw new global.errs.AuthFailed("openid获取失败: " + errmsg);
    }
    // 此时已经拿到了openid,现在可以把用户信息写入数据库,并给用户一个 uid
    // 注意，用户第一次访问的时候，user表中没有 openid 的信息，可以写入openid
    // 但假若用户登陆状态失效了，再次登录应该先查一下user中有没有openid，有的话不应该再次写入
    let user = await User.getUserByOpenid(result.data.openid);
    if (!user) {
      user = await User.registerByOpenid(result.data.openid);
    }
    return generateToken(user.id, Auth.USER);
  }
}
module.exports = {
  WXManager
};
