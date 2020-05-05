const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");

class Flow extends Model {}
Flow.init(
  {
    indexs: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
  },
  {
    sequelize,
    tableName: "flow"
  }
);

// 关于art_id,type为100定位到movie表,art_id为1可以定位到表中第一条数据
// 数据库表与表之间是有关联的，表与表之间的关联是构建整个数据库的基础

module.exports = {
  Flow
};
