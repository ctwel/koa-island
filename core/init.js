const requireDirectory = require("require-directory");
const Router = require("koa-router");

class InitManager {
  // 入口总方法
  static initCore(app) {
    InitManager.app = app;
    InitManager.initLoadRouters();
    InitManager.LoadHttpException();
    InitManager.InitLoadConfig();
  }

  // requireDirectory实现路由自动加载
  static initLoadRouters() {
    const apiDirectory = `${process.cwd()}/app/api`;
    // 参数：第一个参数固定参数module，第二个参数要加载的模块的文件路径，第三个参数：每次加载一个参数执行的函数
    requireDirectory(module, apiDirectory, { visit: whenLoadModule });

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }

  // 设置各种异常为全局的
  static LoadHttpException() {
    const errors = require("./http-exception.js");
    global.errs = errors;
  }

  // 将配置设置为全局的
  static InitLoadConfig(path = "") {
    const configPath = path || process.cwd() + "/config/config.js";
    const config = require(configPath);
    global.config = config;
  }
}

module.exports = InitManager;
