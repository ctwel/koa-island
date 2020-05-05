const { LoginType, ArtType } = require("../lib/enum");
const { LinValidator, Rule } = require("../../core/lin-validator");
const { User } = require("../models/user");

// 校验正整数
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule("isInt", "需要是正整数", { min: 1 })];
  }
}

// 校验注册邮箱、密码和昵称
class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [new Rule("isEmail", "不符合Email规范")];
    this.password1 = [
      // 用户指定范围 123456 $^
      new Rule("isLength", "密码至少6个字符，最多32个字符", {
        min: 6,
        max: 32
      }),
      new Rule(
        "matches",
        "密码不符合规范",
        "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]"
      )
    ];
    this.password2 = this.password1;
    this.nickname = [
      new Rule("isLength", "昵称不符合长度规范", {
        min: 4,
        max: 32
      })
    ];
  }

  // 注册两个密码是否一样
  validatePassword(vals) {
    // vals 包含用户传递过来的所有参数
    const psw1 = vals.body.password1;
    const psw2 = vals.body.password2;
    if (psw1 !== psw2) {
      throw new Error("两个密码必须相同");
      // Linvalidator会处理这个异常，抛出特定 ParamsException
    }
  }

  // 校验数据库是否已经有该邮箱
  async validateEmail(vals) {
    const email = vals.body.email;
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (user) {
      throw new Error("Email已存在");
    }
  }
}

// 校验
class ValidationToken extends LinValidator {
  constructor() {
    super();
    // 账号
    this.account = [
      new Rule("isLength", "不符合账号规则", { min: 4, max: 32 })
    ];
    // 密码 可有可没有，传统登录必须有，小程序不需要
    this.secret = [
      new Rule("isOptional", "不符合账号规则", { min: 4, max: 32 }),
      new Rule("isLength", "至少6个字符", { min: 6, max: 128 })
    ];
  }
  // 判断当前用户登录的方式
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error("type是必须参数");
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error("type参数不合法");
    }
  }
}

class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = [new Rule("isLength", "不允许为空", { min: 1 })];
  }
}

function checkType(vals) {
  let type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必须参数");
  }
  type = parseInt(type);
  // LinValidator内部变量parsed可以用来保存转型后的变量
  // 在外面可以用 v.get 直接取到了
  // this.parsed.path.type = type
  if (!LoginType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}

function checkArtType(vals) {
  let type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必须参数");
  }
  type = parseInt(type);
  // LinValidator内部变量parsed可以用来保存转型后的变量
  // 在外面可以用 v.get 直接取到了
  // this.parsed.path.type = type
  if (!ArtType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}

// 校验用户点赞接口的参数 id 和 type
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkArtType;
  }
}

// 校验某期点赞信息接口的参数
class ClassicValidator extends LikeValidator {}
// 因为校验参数基本一致 id type

class SearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = [
      new Rule("isLength", "搜索关键词不能为空", {
        min: 1,
        max: 16
      })
    ];
    this.start = [
      new Rule("isInt", "不符合规范", {
        min: 0,
        max: 60000
      }),
      new Rule("isOptional", "", 0)
    ];
    this.count = [
      new Rule("isInt", "不符合规范", {
        min: 1,
        max: 20
      }),
      new Rule("isOptional", "", 20)
    ];
    // 关于分页，老式 pageNum，perPage 新式的 start，count
    // 对于 start count 来说，没有页数概念。start 代表从多少条开始取，count 代表连续取多少条
    // 有两种情况：
    // 1. 用户不传 start count 我们需要给一个默认值
    // 2. 给了 start count 对其进行校验
  }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.content = [
      new Rule("isLength", "必须在1~12个字符之间", {
        min: 1,
        max: 12
      })
    ];
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  ValidationToken,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator,
  SearchValidator,
  AddShortCommentValidator
};
