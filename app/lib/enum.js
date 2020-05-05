function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true;
    }
  }
  return false;
}

const LoginType = {
  // 小程序登录
  USER_MINI_PROGRAM: 100,
  // 用户email登录
  USER_EMAIL: 101,
  // 手机号登陆
  USER_MOBILE: 102,
  // 管理员登录
  ADMIN_EMAIL: 200,
  isThisType
};
const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isThisType
};

module.exports = {
  LoginType,
  ArtType
};
