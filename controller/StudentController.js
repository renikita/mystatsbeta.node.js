            const express = require('express');
            const router = express.Router();
            const session = require('express-session');
            const bodyParser = require('body-parser');
            const HomeworkRepository = require('../repository/HomeworkRepository');
            const StudentRepository = require('../repository/StudentRepository');
            const StudentResponseRepository = require('../repository/StudentResponseRepository');
            const TeacherRepository = require('../repository/TeacherRepository');

            const HomeworkService = require('../service/HomeworkService');
const {DateTime: LocalDateTime} = require("luxon");


            router.use(bodyParser.urlencoded({ extended: true }));
            router.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));


            const homeworkRepository = new HomeworkRepository();
            const studentRepository = new StudentRepository();
            const studentResponseRepository = new StudentResponseRepository();
            const teacherRepository = new TeacherRepository();

            const homeworkService = new HomeworkService();

            // GET /api/students/settings
            router.get('/settings', (req, res) => {
                const session = req.session;
                const role = session.role;
                const userId = session.userId;

                res.render('settings'); // Render the settings page
            });

            // GET /api/students/mystats
            router.get('/mystats', async (req, res) => {
                const session = req.session;
                const role = session.role;
                const userId = session.userId;

                const student = await studentRepository.findById(userId);
                const teacher = await teacherRepository.findById(student.teacher_id);
                console.log(teacher);
                const responseList = await studentResponseRepository.findAllResponsesByStudent(student.id);
                const { DateTime } = require('luxon');

                const currentTime = DateTime.now();
                for (const response of responseList) {
                    const deadlineTime = DateTime.fromJSDate(response.deadline);

                    if (response.mark !== null) {
                        response.homework_status = "COMPLETED";
                    } else if (response.response_text !== null) {
                        response.homework_status = "ON_CHECK";
                    } else if (deadlineTime.diff(currentTime).milliseconds < 0) {
                        response.homework_status = "PENAL";
                    } else {
                        response.homework_status = "CURRENT";
                    }
                    await studentResponseRepository.save(response);
                    console.log(response);
                }

                res.render('mystats', {
                    name: student ? student.name : null,
                    teachername: teacher ? teacher.name : null,
                    responseList: responseList

                });
                console.log('Student responses:', responseList)
            });

            // POST /api/students/upload
            router.post('/upload', async (req, res) => {
                const { homeworkText, homeworkId } = req.body;
                const session = req.session;
                const userId = session.userId;

                const student = await studentRepository.findById(userId);
                const homework = await homeworkRepository.findById(homeworkId);

                if (student && homework) {
                    const uploadTime = new Date();
                    const response = await studentResponseRepository.findByStudentAndHomework(userId, homeworkId);
                    const changes = {

                        response_text: homeworkText,
                        homework_status: 'ON_CHECK',
                        response_time: uploadTime
                    };

                    console.log("response", response);
                    console.log("changes", changes);
                    await studentResponseRepository.update(response, changes);
                    console.log("response", response);
                }

                res.redirect('/api/students/mystats');
            });


router.post('/create', async (req, res) => {
    const { name, login, password } = req.body;

    const student = {
        name: name,
        login: login,
        password: password,
        role: 'STUDENT',
        status: 'ACTIVATED'
    };

    await studentRepository.save(student);

    res.redirect('/api/students/mystats');
});
            module.exports = router;