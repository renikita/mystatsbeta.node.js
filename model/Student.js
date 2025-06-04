const User = require('../modelparent/User');

    class Student extends User {
        constructor(id, homework, uploadTime, responses, teacher, homeworks, login, name, password, role, status) {
            super(login, name, password, role, status);
            this.id = id;
            this.homework = homework;
            this.uploadTime = uploadTime;
            this.responses = responses;
            this.teacher = teacher;
            this.homeworks = homeworks;
        }
    }

    module.exports = Student;