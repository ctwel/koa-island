class HttpException extends Error {
  constructor(msg, errorCode, code) {
    super();
    this.msg = msg || "服务器异常";
    this.errorCode = errorCode || 10000;
    this.code = code || 400;
  }
}

// 参数验证提示
class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = msg || "参数错误";
    this.errorCode = errorCode || 10000;
  }
}

// 成功提示
class Success extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.Code = 201;
    this.msg = msg || "ok";
    this.errorCode = errorCode || 0;
  }
}

// 当查询结果在数据库中找不到
class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 404;
    this.msg = msg || "资源未找到";
    this.errorCode = errorCode || 10000;
  }
}

// 当密码不正确
class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 401;
    this.msg = msg || "授权失败";
    this.errorCode = errorCode || 10004;
  }
}

// token 不合法
class Forbbiden extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.msg = msg || "禁止访问";
    this.errorCode = errorCode || 10006;
    this.code = 403;
  }
}

class LikeError extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = "你已经点赞过" || msg;
    this.errorCode = 60001 || errorCode;
  }
}

class DislikeError extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = "你已取消点赞" || msg;
    this.errorCode = 60002 || errorCode;
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden,
  LikeError,
  DislikeError
};
