/*
Exercise 3: Define associations

Create a model studentCourse.model.js which uses a 
join table to connect both student & course tables 
with many-to-many relationship
 */
let { sequelize, DataTypes } = require("../lib/index");
let { course } = require("./course.model")
let { student } = require("./student.model");

let studentCourse = sequelize.define("studentCourse", {
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: student,
            key: "id"
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: course,
            key: "id"
        }
    }
})

course.belongsToMany(student, { through: studentCourse })
student.belongsToMany(course, { through: studentCourse })
module.exports = { studentCourse }

