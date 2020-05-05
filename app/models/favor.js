const { sequelize } = require("../../core/db");
const { Sequelize, Model, Op } = require("sequelize");
const { Art } = require("./art");

class Favor extends Model {
  // 业务表
  //用户点赞则增加一条数据，取消点赞则删除一条数据
  static async like(art_id, type, uid) {
    // 先查询库中是否已经有这么一条记录
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    if (favor) {
      throw new global.errs.LikeError();
    }
    return sequelize.transaction(async t => {
      await Favor.create(
        {
          art_id,
          type,
          uid
        },
        { transaction: t }
      );
      const art = await new Art(art_id, type).getData(false);
      await art.increment("fav_nums", { by: 1, transaction: t });
      // 第一个参数指明要加1的字段，第二个参数指明要增加多少
    });
  }

  static async disLike(art_id, type, uid) {
    // 先查询库中是否已经有这么一条记录
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    if (!favor) {
      throw new global.errs.DisLikeError();
    }
    return sequelize.transaction(async t => {
      // 注意是用查询出来的这个 favor
      await favor.destroy({
        force: true,
        transaction: t
      });
      const art = await new Art(art_id, type).getData(false);
      await art.decrement("fav_nums", { by: 1, transaction: t });
      // 第一个参数指明要加1的字段，第二个参数指明要增加多少
    });
  }

  // 查询用户是否喜欢某期期刊
  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });

    return favor ? true : false;
  }

  // 查询用户所有喜欢的期刊
  static async getMyClassicFavors(uid) {
    // 查询多条 findAll
    // 注意 favor 表中是包含书籍的，但我们要求的数据不包含书籍
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400
          // Sequelize 提供的操作符，表示 type != 400
          // 此处 uid 与 type 为且关系
        }
      }
    });
    if (!arts) {
      throw new global.errs.NotFound();
    }
    // !!!循环查询数据库是非常危险的，一定要防止循环查询数据库
    // 使用到 SQL 的 in 查询，可以接收一个集合
    // 将 art_id 装入一个数组里面，将其传入数据库，可以一次就把所有的数据查出来
    return await Art.getList(arts);
  }

  static async getBookFavor(uid, bookID) {
    const favorNums = await Favor.count({
      where: {
        art_id: bookID,
        type: 400
      }
    });
    const myFavor = await Favor.findOne({
      where: {
        art_id: bookID,
        uid,
        type: 400
      }
    });
    return {
      fav_nums: favorNums,
      like_status: myFavor ? 1 : 0
    };
  }
}

Favor.init(
  {
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
  },
  {
    sequelize,
    tableName: "favor"
  }
);

module.exports = {
  Favor
};
