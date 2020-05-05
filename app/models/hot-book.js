const { sequelize } = require("../../core/db");
const { Sequelize, Model, Op } = require("sequelize");
const { Favor } = require("./favor");

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      // 排序条件 order
      order: ["indexs"] // 指明字段 index 默认正序
    });
    // 还需要去 favor 表中查出每本书的用户点赞数量
    // 不可以循环遍历数据库，将书籍 id 汇在一起，组成数组使用 maysql 的in查询
    const ids = [];
    books.forEach(book => ids.push(book.id));
    const favors = await Favor.findAll({
      where: {
        art_id: {
          // 指明对哪个字段进行 in 查询
          [Op.in]: ids
        },
        type: 400
      },
      group: ["art_id"], // 指定分组的参数是 art_id，传入的是一个数组
      attributes: ["art_id", [Sequelize.fn("COUNT", "* "), "count"]] // 决定查询出来的结果包含哪些字段
    });
    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors);
    });
    return books;
  }
  // 合并两个数据结构
  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get("count");
      }
    });
    book.setDataValue("fav_nums", count);
    return book;
  }
}
HotBook.init(
  {
    indexs: Sequelize.INTEGER, // 用来做排序
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING
    // 在图书首页只用展示这些概要信息，详情信息是用户点击了图书进入详情页面才展示的
    // index：在热门书籍页面展示的书籍顺序是非常重要的
  },
  {
    sequelize,
    tableName: "hot_book"
  }
);
module.exports = {
  HotBook
};
