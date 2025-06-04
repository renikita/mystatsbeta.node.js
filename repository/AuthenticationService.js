const TeacherRepository = require('../repository/TeacherRepository');
        const StudentRepository = require('../repository/StudentRepository');

        class AuthenticationService {
            constructor(teacherRepository = new TeacherRepository(), studentRepository = new StudentRepository()) {
                this.teacherRepository = teacherRepository;
                this.studentRepository = studentRepository;
            }

            async authenticate(login, password) {
                const teacher = await this.teacherRepository.findByLogin(login);
                const student = await this.studentRepository.findByLogin(login);

                return (teacher && teacher.password === password) ||
                       (student && student.password === password);
            }

            async getUserRole(login) {
                const teacher = await this.teacherRepository.findByLogin(login);
                if (teacher) {
                    return 'TEACHER';
                }

                const student = await this.studentRepository.findByLogin(login);
                if (student) {
                    return 'STUDENT';
                }

                return null;
            }
        }

        module.exports = AuthenticationService;