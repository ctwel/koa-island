// 项目入口文件
const Koa = require("Koa");
const InitManager = require("./core/init");
const parser = require("koa-bodyparser");
const path = require("path");
const serve = require("koa-static");
const catchError = require("./middlewares/exception");

const app = new Koa();
app.use(parser());
app.use(catchError);
app.use(serve(path.resolve(__dirname, "static")));
InitManager.initCore(app);

app.listen(3000);
