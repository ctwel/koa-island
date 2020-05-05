const { HttpException } = require("../core/http-exception");

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const isHttpException = error instanceof HttpException;
    const isDev = global.config.environment === "dev";
    if (isDev && !isHttpException) {
      throw error;
    }

    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        request: `${ctx.method} ${ctx.path}`,
        error_Code: error.errorCode
      };
      ctx.status = error.code;
    } else {
      ctx.body = {
        msg: "we made a mistake",
        request: `${ctx.method} ${ctx.path}`,
        error_Code: 999
      };
      ctx.status = 500;
    }
  }
};

module.exports = catchError;
