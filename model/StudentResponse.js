class StudentResponse {
        constructor(id, homework, mark, student, responseText, responseTime, homeworkStatus) {
            this.id = id;
            this.homework = homework;
            this.mark = mark;
            this.student = student;
            this.responseText = responseText;
            this.responseTime = responseTime;
            this.homeworkStatus = homeworkStatus;
        }
    }

    module.exports = StudentResponse;