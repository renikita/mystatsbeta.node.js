
const pool = require('../db');

class HomeworkStudentRepository {

    async add(homeworkId, studentId) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(
                'INSERT INTO homework_students (homework_id, student_id) VALUES (?, ?)',
                [homeworkId, studentId]
            );
        } catch (err) {
            console.error('Error adding homework-student relationship:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
    async addHomeworkToStudents(homeworkId, studentIds) {
        let conn;
        try {
            conn = await pool.getConnection();
            const promises = studentIds.map(studentId =>
                conn.query(
                    'INSERT INTO homework_students (homework_id, student_id) VALUES (?, ?)',
                    [homeworkId, studentId]
                )
            );
            await Promise.all(promises);
        } catch (err) {
            console.error('Error adding homework to students:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
    // Find all students for a specific homework
    async findStudentsByHomework(homeworkId) {
        let conn;
        try {
            conn = await pool.getConnection();
            return await conn.query(
                'SELECT * FROM homework_students WHERE homework_id = ?',
                [homeworkId]
            );
        } catch (err) {
            console.error('Error finding students by homework:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    // Find all homework for a specific student
    async findHomeworksByStudent(studentId) {
        let conn;
        try {
            conn = await pool.getConnection();
            return await conn.query(
                'SELECT * FROM homework_students WHERE student_id = ?',
                [studentId]
            );
        } catch (err) {
            console.error('Error finding homeworks by student:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    // Delete a specific homework-student relationship
    async delete(homeworkId, studentId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'DELETE FROM homework_students WHERE homework_id = ? AND student_id = ?',
                [homeworkId, studentId]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error deleting homework-student relationship:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    // Delete all relationships for a specific homework
    async deleteByHomework(homeworkId) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(
                'DELETE FROM homework_students WHERE homework_id = ?',
                [homeworkId]
            );
        } catch (err) {
            console.error('Error deleting relationships by homework:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    // Delete all relationships for a specific student
    async deleteByStudent(studentId) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(
                'DELETE FROM homework_students WHERE student_id = ?',
                [studentId]
            );
        } catch (err) {
            console.error('Error deleting relationships by student:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

}

module.exports = HomeworkStudentRepository;