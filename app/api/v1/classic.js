const Router = require("koa-router");
const { Flow } = require("../../models/flow");
const { Art } = require("../../models/art");
const {
  PositiveIntegerValidator,
  ClassicValidator
} = require("../../validators/validator");
const { successResponse } = require("../../lib/helper");
const { Favor } = require("../../models/favor");
const router = new Router({
  prefix: "/v1/classic"
});
const { Auth } = require("../../../middlewares/auth");

// 查询最新一期
router.get("/latest", new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      ["indexs", "DESC"] // 指明根据index来排序,指明正序还是倒序(DESC),findOne取倒序第一个
    ]
  });
  const art = await new Art(flow.art_id, flow.type).getData();
  // 合并两个模型
  // art.dataValues.index = flow.indexs;
  art.setDataValue("index", flow.indexs);
  ctx.body = art;
});

// 查询当前一期下一期
router.get("/:index/next", new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: "index" });
  const index = v.get("path.index");
  const flow = await Flow.findOne({
    where: {
      indexs: index + 1
    }
  });

  if (!flow) {
    throw new global.errs.NotFound();
  }

  const art = await new Art(flow.art_id, flow.type).getData();
  const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
  art.setDataValue("index", flow.indexs);
  art.setDataValue("like_status", likeNext);
  ctx.body = art;
});

// 查询当前一期上一期
router.get("/:index/previous", new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: "index" });
  const index = v.get("path.index");
  const flow = await Flow.findOne({
    where: {
      indexs: index - 1
    }
  });

  if (!flow) {
    throw new global.errs.NotFound();
  }

  const art = await new Art(flow.art_id, flow.type).getData();
  const likePrevious = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  art.setDataValue("index", flow.indexs);
  art.setDataValue("like_status", likePrevious);
  ctx.body = art;
});

// 获取期刊详情
router.get("/:type/:id/", new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx);
  const id = v.get("path.id");
  const type = parseInt(v.get("path.type"));
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  artDetail.art.setDataValue("like_status", artDetail.like_status);
  ctx.body = artDetail.art;
});

//获取某期点赞信息
router.get("/:type/:id/favor", new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx);
  const id = v.get("path.id");
  const type = parseInt(v.get("path.type"));
  // 获赞总数 当前点赞
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  artDetail.art.setDataValue("like_status", artDetail.like_status);
  ctx.body = {
    fav_nums: artDetail.art.fav_nums,
    like_status: artDetail.like_status
  };
});

// 获取用户喜欢的所有期刊
router.get("/favor", new Auth().m, async ctx => {
  const uid = ctx.auth.uid;
  ctx.body = await Favor.getMyClassicFavors(uid);
});

module.exports = router;
