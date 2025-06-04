const { expect } = require('chai');
const pool = require('../db');
const HomeworkRepository = require('../repository/HomeworkRepository');

describe('HomeworkRepository', () => {
    let homeworkRepository;
    let teacherId;

    before(async () => {
        homeworkRepository = new HomeworkRepository();
        const conn = await pool.getConnection();

        // Create the teachers table if it doesn't exist
        await conn.query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                login VARCHAR(255),
                password VARCHAR(255),
                role VARCHAR(50),
                status VARCHAR(50)
            )
        `);

        // Create the homeworks table if it doesn't exist
        await conn.query(`
            CREATE TABLE IF NOT EXISTS homeworks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name_homework VARCHAR(255),
                task TEXT,
                description TEXT,
                upload_time DATETIME,
                deadline DATETIME,
                teacher_id INT,
                CONSTRAINT homeworks_ibfk_1 FOREIGN KEY (teacher_id) REFERENCES teachers (id)
            )
        `);

        // Insert a teacher record and store its ID
        const result = await conn.query(`
            INSERT INTO teachers (name, login, password, role, status)
            VALUES ('Test Teacher', 'teacherlogin', 'password123', 'TEACHER', 'ACTIVATED')
        `);
        teacherId = result.insertId; // Save the teacher ID for use in tests

        conn.release();
    });

    after(async () => {
        const conn = await pool.getConnection();
        await conn.query('DROP TABLE IF EXISTS homeworks');
        await conn.query('DROP TABLE IF EXISTS teachers');
        conn.release();
    });

    beforeEach(async () => {
        const conn = await pool.getConnection();
        await conn.query('DELETE FROM homeworks');
        conn.release();
    });

    it('should save a new homework', async () => {
        const homework = {
            name_homework: 'Test Homework',
            task: 'Test Task',
            description: 'Test Description',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        const savedHomework = await homeworkRepository.save(homework);
        expect(savedHomework).to.have.property('id');
        expect(savedHomework.name_homework).to.equal('Test Homework');
    });

    it('should find a homework by ID', async () => {
        const homework = {
            name_homework: 'Test Homework',
            task: 'Test Task',
            description: 'Test Description',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        const savedHomework = await homeworkRepository.save(homework);
        const foundHomework = await homeworkRepository.findById(savedHomework.id);
        expect(foundHomework).to.not.be.null;
        expect(foundHomework.name_homework).to.equal('Test Homework');
    });

    it('should find all homeworks', async () => {
        const homework1 = {
            name_homework: 'Homework 1',
            task: 'Task 1',
            description: 'Description 1',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        const homework2 = {
            name_homework: 'Homework 2',
            task: 'Task 2',
            description: 'Description 2',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        await homeworkRepository.save(homework1);
        await homeworkRepository.save(homework2);

        const allHomeworks = await homeworkRepository.findAll();
        expect(allHomeworks).to.have.lengthOf(2);
    });

    it('should delete a homework by ID', async () => {
        const homework = {
            name_homework: 'Test Homework',
            task: 'Test Task',
            description: 'Test Description',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        const savedHomework = await homeworkRepository.save(homework);
        const isDeleted = await homeworkRepository.deleteById(savedHomework.id);
        expect(isDeleted).to.be.true;

        const foundHomework = await homeworkRepository.findById(savedHomework.id);
        expect(foundHomework).to.be.null;
    });

    it('should delete all homeworks', async () => {
        const homework1 = {
            name_homework: 'Homework 1',
            task: 'Task 1',
            description: 'Description 1',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        const homework2 = {
            name_homework: 'Homework 2',
            task: 'Task 2',
            description: 'Description 2',
            upload_time: new Date(),
            deadline: new Date(),
            teacher_id: teacherId, // Use the teacher ID created in the setup
        };

        await homeworkRepository.save(homework1);
        await homeworkRepository.save(homework2);

        await homeworkRepository.deleteAll();
        const allHomeworks = await homeworkRepository.findAll();
        expect(allHomeworks).to.be.empty;
    });
});