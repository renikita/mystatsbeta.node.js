
const StudentResponseRepository = require('../../repository/StudentResponseRepository');

class StudentResponseServicedb {
    constructor(studentResponseRepository = new StudentResponseRepository()) {
        this.studentResponseRepository = studentResponseRepository;
    }

    saveResponse(response) {
        this.studentResponseRepository.save(response);
    }

    findResponsesByStudentAndHomework(student, homework) {
        return this.studentResponseRepository.findResponsesByStudentAndHomework(student, homework);
    }

    findAllResponsesByStudent(student) {
        return this.studentResponseRepository.findAllResponsesByStudent(student);
    }

    findByStudentAndHomework(student, homework) {
        return this.studentResponseRepository.findByStudentAndHomework(student, homework);
    }

    findByStudent(student) {
        return null; // Not implemented
    }

    findByHomework(homework) {
        return null; // Not implemented
    }
}

module.exports = StudentResponseServicedb;