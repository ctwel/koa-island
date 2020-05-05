const Router = require("koa-router");
const { HotBook } = require("../../models/hot-book");
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator
} = require("../../validators/validator");
const { Book } = require("../../models/book");
const { Auth } = require("../../../middlewares/auth");
const { Favor } = require("../../models/favor");
const { Comment } = require("../../models/book-comment");
const { successResponse } = require("../../lib/helper");
const router = new Router({
  prefix: "/v1/book"
});

// 获取热门图书列表
router.get("/hot_list", async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = books;
});
// 获取图书详情接口
router.get("/:id/detail", async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = new Book();
  ctx.body = await book.detail(v.get("path.id"));
});

// 图书搜索接口
router.get("/search", async ctx => {
  const v = await new SearchValidator().validate(ctx);
  // 前端通过 body 传参
  const result = await Book.searchFromYuShu(
    v.get("query.q"),
    v.get("query.start"),
    v.get("query.count")
  );
  ctx.body = result;
});

// 获取我喜欢的书籍的数量接口
router.get("/favor/count", new Auth().m, async ctx => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid);
  ctx.body = {
    count
  };
});

// 获取某本书籍点赞情况接口
router.get("/:book_id/favor", new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id" // 别名，将id改为book_id
  });
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get("path.book_id"));
  ctx.body = favor;
});

router.post("/add/short_comment", new Auth().m, async ctx => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: "book_id"
  });
  Comment.addComment(v.get("body.book_id"), v.get("body.content"));
  successResponse({ ctx });
});

router.get("/:book_id/short_comment", new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id"
  });
  const book_id = v.get("path.book_id");
  const comments = await Comment.getComments(book_id);
  ctx.body = {
    comments,
    book_id
  };
});
module.exports = router;
