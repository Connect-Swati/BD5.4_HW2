let express = require("express")
let app = express();
app.use(express.json());

let port = 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
})
let { course } = require("./models/course.model")
let { student } = require("./models/student.model");
let { studentCourse } = require("./models/studentCourse.model");
let { sequelize } = require("./lib/index");

let courseData = [
    { title: 'Math 101', description: 'Basic Mathematics' },
    { title: 'History 201', description: 'World History' },
    { title: 'Science 301', description: 'Basic Sciences' },
];

let studentsData = [
    { name: 'John Doe', age: 24 }
];

app.get("/", (req, res) => {
    res.status(200).json({ message: "BD5.4 - HW2 Application" });
});

//seed_db

app.get("/seed_db", async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        let courseDataInserted = await course.bulkCreate(courseData);
        let studentsDataInserted = await student.bulkCreate(studentsData);
     //self study
        let modelsCreated = Object.keys(sequelize.models);
        return res.status(200).json({
            message: "Database seeded successfully",
            tablesCreated : modelsCreated,
            courseData: courseDataInserted,
            studentData: studentsDataInserted
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error seeding database",
            error: error.message
        })

    }


})


// self - to fetch data from all tables

app.get("/getAllData", async (req, res) => {
    try {
        let courseResult = await course.findAll();
        let studentResult = await student.findAll();
        let studentCourseResult = await studentCourse.findAll();
        return res.status(200).json({
            message: "Data fetched successfully",
            courseData: courseResult,
            studentData: studentResult,
            studentCourseData: studentCourseResult
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error fetching data",
            error: error.message
        })

    }
})

/*
Exercise 1: Create New Student

Create an endpoint /students/new that will create a new student record in the database.

Declare a variable named newStudent to store the data from the request body, i.e., req.body.newStudent.

Create a function named addNewStudent to create a new record in the database based on the request body.

API Call

http://localhost:3000/students/new

Request Body

{
  'newStudent': {
    'name': 'David',
    'age': 25
  }
}

Expected Output

{
  'newStudent': {
    'id': 4,
    'name': 'David',
    'age': 25
  }
}


*/

// fucntion to create new student

async function addNewStudent(newStudent) {
    try {
        let result = await student.create(newStudent);
        if (!result) {
            throw new Error("Failed to create new student");

        }
        return { newStudent: result };

    } catch (error) {
        console.log("error in creating new student ", error.message);
        return error;


    }

}

//endpoint to create new student
app.post("/students/new", async (req, res) => {
    try {
        let newStudent = req.body.newStudent;
        let result = await addNewStudent(newStudent);
        res.status(200).json(result);

    } catch (error) {
        if (error.message === "Failed to create new student") {
            res.status(404).json({
                code: 404,
                message: "Failed to create new student",
                error: error.message
            })
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                error: error.message
            })
        }


    }
})

/*
Exercise 2: Update Student by ID

Create an endpoint /students/update/:id that will update an existing student record by ID.

Declare a variable named newStudentData to store the data from the request body, i.e., req.body.

Create a function named updateStudentById to update the student record in the database based on the ID and request body.

API Call

http://localhost:3000/students/update/1

Request Body

{
  'name': 'Alice Updated',
  'age': 23
}

Expected Output

{
  'message': 'Student updated successfully',
  'updatedStudent': {
    'id': 1,
    'name': 'Alice Updated',
    'age': 23
  }
}
   */

//function to update  student by id
async function updateStudentById(newStudentData,id) {
    try {
        let studentToBeUpdated = await student.findByPk(id)
        if(!studentToBeUpdated){
            return new Error("student  not found");

        }
        let updatedStudent = await studentToBeUpdated.update(newStudentData);
        return{
            message: 'Student updated successfully',
            updatedStudent: updatedStudent
        }
        
    } catch (error) {
        console.log("error in updating student by id ", error.message)
        throw error
    }
    
}

// endpoint to updated student by id
app.post("/students/update/:id" ,  async (req, res) => {
    try {
        
        let id = req.params.id
        let newStudentData = req.body
        let result = await  updateStudentById(newStudentData,id);
        return res.status(200).json(result)

    } catch (error) {
        if(error.message ===  "student  not found"){
            return res.status(404).json({
                code: 404,
                message: "student not found",
            error : error.message
        })
        }else {
            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                error : error.message
                })
        }

        
    }
})

