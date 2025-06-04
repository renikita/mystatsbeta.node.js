// File: controller/TeacherController.js

    const express = require('express');
    const router = express.Router();
    const session = require('express-session');
    const bodyParser = require('body-parser');
    const HomeworkRepository = require('../repository/HomeworkRepository');
    const StudentRepository = require('../repository/StudentRepository');
    const StudentResponseRepository = require('../repository/StudentResponseRepository');
    const TeacherRepository = require('../repository/TeacherRepository');

    const HomeworkService = require('../service/HomeworkService');

    // Middleware
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

    // Repositories and Services
    const homeworkRepository = new HomeworkRepository();
    const studentRepository = new StudentRepository();
    const studentResponseRepository = new StudentResponseRepository();
    const teacherRepository = new TeacherRepository();

    const homeworkService = new HomeworkService();

    let localStudentName = null;

    // GET /api/teachers/teacherdashboard/:studentName
    router.get('/teacherdashboard/:studentName', (req, res) => {
        localStudentName = req.params.studentName;
        res.redirect('/api/teachers/teacherdashboard');
    });

    // GET /api/teachers/teacherdashboard/all
    router.get('/teacherdashboard/all', (req, res) => {
        localStudentName = 'All';
        res.redirect('/api/teachers/teacherdashboard');
    });

    // GET /api/teachers/teacherdashboard
router.get('/teacherdashboard', async (req, res) => {
    const session = req.session;
    const userId = session.userId;

    try {
        const teacher = await teacherRepository.findById(userId);
        const students = await studentRepository.findAll();
        const homeworkList = await homeworkRepository.findAll();

        const MinTerminTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
        const MaxTerminTime = new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString();

        const model = {
            name: teacher ? teacher.name : null,
            localmindate: MinTerminTime,
            localmaxdate: MaxTerminTime,
            homeworkList,
            students,
            responseList: [],
            studentname: localStudentName || null,
        };

        if (localStudentName) {
            console.log(localStudentName);
                const student = await studentRepository.findByName(localStudentName);
                const responses = await studentResponseRepository.findAllResponsesByStudent(student.id);
                const students = await studentRepository.findAll();
                console.log(responses);
                model.responseList = responses;
                model.studentname = student.name;
                model.students = students;

        }

        res.render('teacherdashboard', model);
    } catch (error) {
        console.error('Error rendering teacher dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

    // POST /api/teachers/addhomework
    router.post('/addhomework', async (req, res) => {
        const {userId, name_homework, task, description, deadline, student } = req.body;
        const session = req.session;
        //const userId = session.userId;

        const teacher = await teacherRepository.findById(userId);
        const createHomework = {
            name_homework: name_homework,
            task,
            description,
            deadline: new Date(deadline),
            teacher,
            upload_time: new Date(),
        };
        await homeworkRepository.save(createHomework);


        const nameArray = student.split(',');
        for (const name of nameArray) {
            const student = await studentRepository.findByName(name);
            if (student) {
                await studentResponseRepository.save({
                    student_id: student.id,
                    homework_id: createHomework.id,
                    responseText: null,
                    mark: null,
                    responseTime: null,
                });
            }
        }



        res.redirect('/api/teachers/teacherdashboard');
    });

    // POST /api/teachers/deletehomework
    router.post('/deletehomework', async (req, res) => {
        const { homework } = req.body;
        for (const homeworkId of homework) {
            const response = await studentResponseRepository.findById(homeworkId);
            if (response) {
                await studentResponseRepository.delete(response);
            }
        }
        res.redirect('/api/teachers/teacherdashboard');
    });

    // POST /api/teachers/upload
    router.post('/upload', async (req, res) => {
        const { markInteger, homeworkId } = req.body;

        const responses = await studentResponseRepository.findAll();
        const response = responses.find((r) => r.id === parseInt(homeworkId));

        if (response) {
            const student = await studentRepository.findById(response.student.id);
            const updatedResponse = await studentResponseRepository.findByStudentAndHomework(student, response.homework);

            updatedResponse.mark = parseInt(markInteger);
            updatedResponse.homeworkStatus = 'COMPLETED';
            await studentResponseRepository.save(updatedResponse);
        }

        res.redirect('/api/teachers/teacherdashboard');
    });

    //POST /api/teacher/create
    router.post('/create', async (req, res) => {
    const { name, login, password } = req.body;

    const teacher = {
        name: name,
        login: login,
        password: password,
        role: 'TEACHER',
        status: 'ACTIVATED'
    };

    await teacherRepository.save(teacher);

    res.redirect('/api/teachers/teacherdashboard');
});


    module.exports = router;