const {
  Op
} = require("sequelize");
const {
  flatten
} = require("lodash");
const {
  Movie,
  Music,
  Sentence
} = require("./classic");
class Art {
  constructor(art_id, type) {
    // 把决定一个对象特征的相关参数保存到它的属性里
    this.art_id = art_id;
    this.type = type;
  }

  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    };
    // artInfoList 从数据库中查询出来是个数组
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (let key in artInfoObj) {
      // 判断数组为空则跳出当前循环
      const ids = artInfoObj[key];
      if (ids.length === 0) {
        continue;
      }
      // key 是对象，因为 Object 的 key 都是字符串，会导致下面case匹配无效
      key = parseInt(key);
      arts.push(await Art._getListByType(ids, key));
    }
    // 二维数组展开
    return flatten(arts);
    // return arts.flat()
  }

  static async _getListByType(ids, type) {
    let arts = [];
    // 查询多个数据
    const finder = {
      where: {
        id: {
          [Op.in]: ids
          // [Op.in]接收一个数组
        }
      }
    };
    const scope = "bh";
    switch (type) {
      // movie
      case 100:
        arts = await Movie.scope(scope).findOne(finder);
        break;
        // music
      case 200:
        arts = await Music.scope(scope).findOne(finder);
        break;
        // sentence
      case 300:
        arts = await Sentence.scope(scope).findOne(finder);
        break;
        // book
      case 400:
        break;
      default:
        break;
    }
    return arts;
  }

  async getDetail(uid) {
    const {
      Favor
    } = require("./favor"); // 不要放在文件头部，避免循环加载
    const art = await new Art(this.art_id, this.type).getData();
    if (!art) {
      throw new global.errs.NotFound();
    }
    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    return {
      art,
      like_status: like
    };
  }

  async getData(useScope = true) {
    let art = null;
    const finder = {
      where: {
        id: this.art_id
      }
    };
    const scope = useScope ? "bh" : null;
    switch (this.type) {
      // movie
      case 100:
        art = await Movie.scope(scope).findOne(finder);
        break;
        // music
      case 200:
        art = await Music.scope(scope).findOne(finder);
        break;
        // sentence
      case 300:
        art = await Sentence.scope(scope).findOne(finder);
        break;
        // book
      case 400:
        const {
          Book
        } = require("./book");
        art = await Book.scope(scope).findOne(finder);
        if (!art) {
          art = await Book.create({
            id: this.art_id
          });
        }
        break;
      default:
        break;
    }
    // if (art && art.image) {
    //   let imgUrl = art.dataValues.image;
    //   art.dataValues.image = global.config.host + imgUrl;
    // }
    return art;
  }
}
module.exports = {
  Art
};