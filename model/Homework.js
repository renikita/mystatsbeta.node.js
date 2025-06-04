
        class Homework {
            constructor(id, nameHomework, task, description, uploadTime, deadline, homeworkStatus, teacher, students) {
                this.id = id;
                this.nameHomework = nameHomework;
                this.task = task;
                this.description = description;
                this.uploadTime = uploadTime;
                this.deadline = deadline;
                this.homeworkStatus = homeworkStatus;
                this.teacher = teacher;
                this.students = students;
            }
        }

        module.exports = Homework;