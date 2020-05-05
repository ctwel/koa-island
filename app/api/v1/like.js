const Router = require("koa-router");
const { Auth } = require("../../../middlewares/auth");
const { LikeValidator } = require("../../validators/validator");
const { Favor } = require("../../models/favor");
const { successResponse } = require("../../lib/helper");
const router = new Router({
  prefix: "/v1/like"
});

// 用户点赞接口
router.post("/", new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, {
    id: "art_id" // linValidator 别名 alias
  });
  await Favor.like(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid);
  // 为什么uid这么特殊，因为有可能用户在body内篡改自己的uid拿到别人的数据
  successResponse({ ctx });
});

// 用户取消点赞接口
router.post("/cancel", new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, {
    id: "art_id" // linValidator 别名 alias
  });
  await Favor.disLike(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid);
  // 为什么uid这么特殊，因为有可能用户在body内篡改自己的uid拿到别人的数据
  successResponse({ ctx });
});
module.exports = router;
