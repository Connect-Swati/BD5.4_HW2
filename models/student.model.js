let { sequelize, DataTypes } = require("../lib/index");
let student = sequelize.define("student", {
    name: DataTypes.TEXT,
    age: DataTypes.INTEGER
})
module.exports = { student }