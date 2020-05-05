const Sequelize = require("sequelize");
const {
  dbName,
  host,
  port,
  user,
  password
} = require("../config/config").database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql", // 指定数据库类型,要连接 mysql,必须安装驱动包mysql2
  host, // host:host
  port,
  logging: false, // 在终端显示原始操作的sql
  timezone: "+08:00", // 时区，设置为北京时间
  // 配置个性化参数
  define: {
    timestamps: true,
    paranoid: true, //生成 deletedAt 字段 开启软删除
    createdAt: "created_at", // 自定义字段名，默认为'createdAt'，将其改为'created_at'
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    underscored: true, // 字段驼峰转下划线
    // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    freezeTableName: true,
    scopes: {
      // 忽略字段
      bh: {
        // 过滤不必要的字段（这里会有bug）
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"]
        }
      }
    }
  }
});
//调用sequelize.sync()来自动同步所有模型。
sequelize.sync({
  // 是否强行增加字段，会把原来的表的数据删除，生产环境不建议使用
  force: false
});

module.exports = {
  sequelize
};
