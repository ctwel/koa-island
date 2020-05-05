const Router = require("koa-router");
const {
  ValidationToken,
  NotEmptyValidator
} = require("../../validators/validator");
const { LoginType } = require("../../lib/enum");
const { User } = require("../../models/user");
const { WXManager } = require("../../services/wx");
const { generateToken } = require("../../../core/util");
const { Auth } = require("../../../middlewares/auth");
const router = new Router({
  prefix: "/v1/token"
});

// 根据不同的登录方式，返回客户端不同的token
router.post("/", async ctx => {
  const v = await new ValidationToken().validate(ctx);
  let token;
  switch (v.get("body.type")) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get("body.account"), v.get("body.secret"));
      break;

    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeTOToken(v.get("body.account"));
      break;

    default:
      throw new global.errs.ParameterException("没有相关处理函数");
  }
  ctx.body = {
    token
  };
});

router.post("/verify", async ctx => {
  // 验证传入 token 不为空
  const v = await new NotEmptyValidator().validate(ctx);
  const result = Auth.verifyToken(v.get("body.token"));
  ctx.body = {
    is_valid: result
  };
});

// 比对客户端传递的用户名和密码是否与数据库中的一致，如果一致就颁布令牌
async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);
  return generateToken(user.id, 2);
}

module.exports = router;
