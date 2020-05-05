module.exports = {
  // dev表示开发环境，prod表示生产环境
  environment: "dev",
  database: {
    dbName: "island",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root1"
  },
  security: {
    secretKey: "abcdefg", // 非常重要,要非常复杂
    expiresIn: 60 * 60 * 24 * 30 // 过期时间 1 个小时
  },
  wx: {
    appId: "wx8476f9c46edd0391",
    appSecret: "40e717ff6378e28c012180b0605d0405",
    loginUrl:
      "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
  },
  yushu: {
    detailUrl: "http://t.yushu.im/v2/book/id/%s",
    keywordUrl:
      "http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s"
  },
  host: "http://localhost:3000/"
};
