const Router = require("koa-router");
const { RegisterValidator } = require("../../validators/validator");
const { User } = require("../../models/user");
const router = new Router({
  // 指定注册在这个 router 上的所有中间件 url 路由的前缀
  prefix: "/v1/user"
});

router.post("/register", async ctx => {
  const v = await new RegisterValidator().validate(ctx);
  const user = {
    email: v.get("body.email"),
    password: v.get("body.password2"),
    nickname: v.get("body.nickname")
  };

  await User.create(user);
  throw new global.errs.Success();
});

module.exports = router;
