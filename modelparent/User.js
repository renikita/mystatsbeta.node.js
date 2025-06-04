class User {
    constructor(login, name, password, role, status) {
        this.login = login;
        this.name = name;
        this.password = password;
        this.role = role;
        this.status = status;
    }

    static Role = {
        TEACHER: 'TEACHER',
        STUDENT: 'STUDENT'
    };

    static Status = {
        ACTIVATED: 'ACTIVATED',
        BLOCKED: 'BLOCKED'
    };
}

module.exports = User;