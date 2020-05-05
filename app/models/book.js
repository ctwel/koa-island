const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");
const { Favor } = require("./favor");
const axios = require("axios");
const util = require("util");

class Book extends Model {
  // constructor(id) {
  //   super();
  //   this.id = id;
  // }
  async detail(id) {
    //外部服务类似于我们编写的koa API
    const url = util.format(global.config.yushu.detailUrl, id);
    const detail = await axios.get(url);
    return detail.data;
  }

  static async searchFromYuShu(q, start, count, summary = 1) {
    const url = util.format(
      global.config.yushu.keywordUrl,
      encodeURI(q),
      count,
      start,
      summary
    );
    // 格式化参数原因：
    // 传入的 q、start、count、summary都是动态变化的，每次请求的参数都是不同的
    // 所以配置文件里也没有把 url 写死，而是带参的形式根据实际参数情况进行一个填充
    const result = await axios.get(url);
    // 使用 axios 发送请求，如果携带中文，是要经过编码的
    return result.data;
  }

  static async getMyFavorBookCount(uid) {
    // .count 是 Sequelize 挂载在 model 上面的求数量的一个方法，如果只求数量，就可以直接用count
    const count = await Favor.count({
      where: {
        type: 400,
        uid
      }
    });
    return count;
  }
}
Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true // 主键
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: "book"
  }
);
module.exports = {
  Book
};
