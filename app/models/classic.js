const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");

// 很多js的库现在还不支持 es6 面向对象的继承
const classicFields = {
  image: {
    type: Sequelize.STRING,
    // 每次从模型上读取image时都会执行get方法,可以这么做，但是对此问题无用
    // dataValues 不受 get 方法的影响
    get() {
      return global.config.host + this.getDataValue("image");
    }
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT
};

class Movie extends Model {}
Movie.init(classicFields, { sequelize, tableName: "movie" });

class Sentence extends Model {}
Sentence.init(classicFields, { sequelize, tableName: "sentence" });

const musicFields = Object.assign({ url: Sequelize.STRING }, classicFields);
class Music extends Model {}
Music.init(musicFields, { sequelize, tableName: "music" });

module.exports = {
  Movie,
  Sentence,
  Music
};
