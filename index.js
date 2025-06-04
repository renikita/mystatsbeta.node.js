const express = require('express');
const app = express();
const routes = require('./routes/routes');
const authController = require('./controller/AuthController');
const studentController = require('./controller/StudentController');
const teacherController = require('./controller/TeacherController');
const HomeworkRepository = require('./repository/HomeworkRepository');
const StudentResponseRepository = require('./repository/StudentResponseRepository');
const StudentRepository = require('./repository/StudentRepository');
const TeacherRepository = require('./repository/TeacherRepository');
const HomeworkStudentRepository = require('./repository/HomeworkStudentRepository');
const homeController = require('./controller/HomeController');
const PORT = process.env.PORT || 3000;

const teacherRepository = new TeacherRepository();
const studentRepository = new StudentRepository();
const homeworkRepository = new HomeworkRepository();
const homeworkStudentRepository = new HomeworkStudentRepository();
const studentResponseRepository = new StudentResponseRepository();

// ejs
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


async function initializeData() {
    try {

        await studentResponseRepository.deleteAll();
        await homeworkRepository.deleteAll();
        await studentRepository.deleteAll();
        await teacherRepository.deleteAll();

        const LocalDateTime = require('luxon').DateTime; // Use Luxon for date-time handling


        const teacher = {
            login: "T",
            name: "Danilov",
            password: "tpass",
            role: "TEACHER",
            status: "ACTIVATED",
            task: " ",
        };
        const savedTeacher = await teacherRepository.save(teacher);
        console.log("Saved teacher:", savedTeacher);

        const student = {
            login: "S",
            name: "Gasarov",
            password: "spass",
            role: "STUDENT",
            status: "ACTIVATED",
            teacherId: savedTeacher.id,
        };
        const savedStudent = await studentRepository.save(student);

        const student1 = {
            login: "S1",
            name: "Lopez",
            password: "spass",
            role: "STUDENT",
            status: "ACTIVATED",
            teacherId: savedTeacher.id,
        };
        const savedStudent1 = await studentRepository.save(student1);

        const student2 = {
            login: "pavlyk0783",
            name: "Evgenia",
            password: "qwer1234",
            role: "STUDENT",
            status: "ACTIVATED",
            teacherId: savedTeacher.id,
        };
        const savedStudent2 = await studentRepository.save(student2);

// Add students to teacher
        await teacherRepository.addStudents(savedTeacher.id, [savedStudent.id, savedStudent1.id, savedStudent2.id]);

// Create Homework 1


        const uploadTime1 = LocalDateTime.fromObject({ year: 2025, month: 10, day: 23, hour: 10, minute: 30 });
        const deadline1 = LocalDateTime.fromObject({ year: 2024, month: 3, day: 23, hour: 10, minute: 30 });


        const uploadTimeFormatted1 = uploadTime1.toFormat('yyyy-MM-dd HH:mm:ss');
        const deadlineFormatted1 = deadline1.toFormat('yyyy-MM-dd HH:mm:ss');

        const homework1 = {
            name_homework: "Java Utilities",
            task: "Working with Java, Add new method",
            description: "Develop a Java program for working with various utilities. The main goal of this task is to implement a new method in an existing utility that allows you to perform various actions with data. The new method must be designed to process text data and must perform some functionality, such as encryption, filtering, or transformation. The task also includes writing the necessary tests to verify the correct operation of the new method and ensure compliance with the specification requirements.",
            upload_time: uploadTimeFormatted1,
            deadline: deadlineFormatted1,
            teacher_id: savedTeacher.id,
        };
        console.log(homework1);
        const savedHomework1 = await homeworkRepository.save(homework1);

// Create Student Responses for Homework 1
        await studentResponseRepository.save({
            student_id: savedStudent.id,
            homework_id: savedHomework1.id,
            responseText: null,
            mark: null,
            responseTime: null,
        });

        await studentResponseRepository.save({
            student_id: savedStudent1.id,
            homework_id: savedHomework1.id,
            responseText: null,
            mark: null,
            responseTime: null,
        });

// Create Homework 2
        const uploadTime2 = LocalDateTime.fromObject({ year: 2025, month: 1, day: 23, hour: 10, minute: 30 });
        const deadline2 = LocalDateTime.fromObject({ year: 2024, month: 2, day: 23, hour: 10, minute: 30 });


        const uploadTimeFormatted2 = uploadTime2.toFormat('yyyy-MM-dd HH:mm:ss');
        const deadlineFormatted2 = deadline2.toFormat('yyyy-MM-dd HH:mm:ss');


        const homework2 = {
            name_homework: "Java Utilities",
            task: "Working with Java, Add new attribute",
            description: "Develop a Java program for working with various utilities. The main goal of this task is to expand the functionality of existing utilities by adding a new attribute that will allow storing additional data for processing. The new attribute can be used to implement various operations or to store additional information about the data. The task also includes writing the necessary tests to verify the correct operation of the new attribute and ensure compliance with the specification requirements.",
            upload_time: uploadTimeFormatted2,
            deadline: deadlineFormatted2,
            teacher_id: savedTeacher.id,

        };
        console.log(homework2);
        const savedHomework2 = await homeworkRepository.save(homework2);

// Create Student Responses for Homework 2
        await studentResponseRepository.save({
            student_id: savedStudent.id,
            homework_id: savedHomework2.id,
            responseText: null,
            mark: null,
            responseTime: null,
        });

        await studentResponseRepository.save({
            student_id: savedStudent1.id,
            homework_id: savedHomework2.id,
            responseText: null,
            mark: null,
            responseTime: null,
        });

// Update Homework Statuses
        const responses = await studentResponseRepository.findAll();
        const { DateTime } = require('luxon'); // переконайся, що це є!

        const currentTime = DateTime.now();

        for (const response of responses) {
            const deadlineTime = DateTime.fromJSDate(response.deadline);
            if (response.mark !== null) {
                response.homework_status = "COMPLETED";
            } else if (response.response_text !== null) {
                response.homework_status = "ON_CHECK";
            } else if (LocalDateTime.fromISO(response.deadline).diff(currentTime).milliseconds < 0) {
                response.homework_status = "PENAL";
            } else {
                response.homework_status = "CURRENT";
            }
            await studentResponseRepository.save(response);
            console.log(response);
        }
        await homeworkStudentRepository.addHomeworkToStudents(savedHomework2.id, [
            savedStudent.id,
            savedStudent1.id,
            savedStudent2.id,
        ]);

        console.log('Database initialized with demo data.');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Call the initializeData function
initializeData();

// Register routes
app.use('/', routes);
app.use('/', authController);
app.use('/api/students', studentController);
app.use('/api/teachers', teacherController);
app.use('/', homeController);

// Start the server
app.listen(PORT, () => {
    console.log(`Сервер запущений на http://localhost:${PORT}`);
});