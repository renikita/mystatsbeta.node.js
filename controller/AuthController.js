const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const TeacherRepository = require('../repository/TeacherRepository');
const StudentRepository = require('../repository/StudentRepository');
const AuthenticationService = require('../repository/AuthenticationService');

const router = express.Router();


router.use(bodyParser.urlencoded({ extended: true }));


router.use(session({
    secret: process.env.SESSION_SECRET || 'localhost-secret-key', // Use environment variable or fallback
    resave: false,
    saveUninitialized: true
}));


const teacherRepository = new TeacherRepository();
const studentRepository = new StudentRepository();
const authenticationService = new AuthenticationService();

// GET /login
router.get('/login', (req, res) => {
    res.render('auth'); // Render the login form (e.g., auth.ejs or auth.html)
});

// POST /login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const response = {};

    if (await authenticationService.authenticate(login, password)) {
        const teacher = await teacherRepository.findByLogin(login);
        const student = await studentRepository.findByLogin(login);

        if (teacher) {
            req.session.role = 'TEACHER';
            req.session.userId = teacher.id;
            response.role = 'TEACHER';
            response.userId = teacher.id.toString();
        } else if (student) {
            req.session.role = 'STUDENT';
            req.session.userId = student.id;
            response.role = 'STUDENT';
            response.userId = student.id.toString();
        }
    } else {
        response.error = 'Incorrect username or password.';
    }

    res.json(response);
});

module.exports = router;