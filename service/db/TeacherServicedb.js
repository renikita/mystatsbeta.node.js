
const TeacherRepository = require('../../repository/TeacherRepository');

class TeacherServicedb {
    constructor(teacherRepository = new TeacherRepository()) {
        this.teacherRepository = teacherRepository;
    }

    save(teacher) {
        return this.teacherRepository.save(teacher);
    }

    findById(id) {
        const teacher = this.teacherRepository.findAll().find(t => t.id === id);
        if (!teacher) {
            throw new Error(`Teacher with ID ${id} not found`);
        }
        return teacher;
    }

    findAll() {
        return this.teacherRepository.findAll();
    }

    saveAllAndFlush(teachers) {
        throw new Error('Not Supported');
    }
}

module.exports = TeacherServicedb;