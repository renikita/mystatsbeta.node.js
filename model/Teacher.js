const User = require('../modelparent/User');

    class Teacher extends User {
        constructor(id, task, students = [], homeworks = [], login, name, password, role, status) {
            super(login, name, password, role, status);
            this.id = id;
            this.task = task;
            this.students = students;
            this.homeworks = homeworks;
        }
    }

    module.exports = Teacher;