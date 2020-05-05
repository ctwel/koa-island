const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");

// 校验用户传来的 token 的合法性
class Auth {
  constructor(level) {
    this.level = level || 1;
    // 定义类属性
    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SUPER_ADMIN = 32;
  }

  get m() {
    return async (ctx, next) => {
      // 通过basicAuth解码获得token，
      const userToken = basicAuth(ctx.req);

      let errMsg = "token不合法";
      // 是否为空的初级判断
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden(errMsg);
      }
      // 校验令牌合法性
      try {
        // 解密获取token携带的用户uid和用户权限scope
        var decode = jwt.verify(
          userToken.name, // token
          global.config.security.secretKey
        );
      } catch (error) {
        //监听到异常则说明用户的令牌是不合法或者过期
        if (error.name === "TokenExpiredError") {
          errMsg = "token已过期";
        }
        throw new global.errs.Forbbiden(errMsg);
      }

      if (decode.scope < this.level) {
        errMsg = "权限不足";
        throw new global.errs.Forbbiden(errMsg);
      }
      // token合法
      ctx.auth = {
        // 取出 jwt 内定义的用户数据
        uid: decode.uid,
        scope: decode.scope
      };
      await next();
    };
  }

  // 客户端校验令牌是否合法
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = {
  Auth
};
