
const StudentRepository = require('../../repository/StudentRepository');

class StudentServicedb {
    constructor(studentRepository = new StudentRepository()) {
        this.studentRepository = studentRepository;
    }

    save(student) {
        return this.studentRepository.save(student);
    }

    findById(id) {
        const student = this.studentRepository.findById(id);
        if (!student) {
            throw new Error(`Student with ID ${id} not found`);
        }
        return student;
    }

    findByName(name) {
        return this.studentRepository.findByName(name);
    }

    changeName(nameBefore, nameAfter) {
        const student = this.studentRepository.findByName(nameBefore);
        if (student) {
            student.name = nameAfter;
            return this.studentRepository.save(student);
        }
        return null;
    }

    findAll() {
        return this.studentRepository.findAll();
    }

    saveAllAndFlush(students) {
        throw new Error('Not Supported');
    }
}

module.exports = StudentServicedb;