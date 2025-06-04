
                                                const pool = require('../db');

                                                class StudentRepository {
                                                    async findById(id) {
                                                        let conn;
                                                        try {
                                                            conn = await pool.getConnection();
                                                            const rows = await conn.query('SELECT * FROM students WHERE id = ?', [id]);
                                                            return rows[0] || null;
                                                        } catch (err) {
                                                            console.error(err);
                                                            throw err;
                                                        } finally {
                                                            if (conn) conn.release();
                                                        }
                                                    }
async deleteAll() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('DELETE FROM students');
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}
                                                    async findAll() {
                                                        let conn;
                                                        try {
                                                            conn = await pool.getConnection();
                                                            return await conn.query('SELECT * FROM students');
                                                        } catch (err) {
                                                            console.error(err);
                                                            throw err;
                                                        } finally {
                                                            if (conn) conn.release();
                                                        }
                                                    }

                                                    async findByName(name) {
                                                        let conn;
                                                        try {
                                                            conn = await pool.getConnection();
                                                            const rows = await conn.query('SELECT * FROM students WHERE name = ?', [name]);
                                                            return rows[0] || null;
                                                        } catch (err) {
                                                            console.error(err);
                                                            throw err;
                                                        } finally {
                                                            if (conn) conn.release();
                                                        }
                                                    }

                                                    async findByLogin(login) {
                                                        let conn;
                                                        try {
                                                            conn = await pool.getConnection();
                                                            const rows = await conn.query('SELECT * FROM students WHERE login = ?', [login]);
                                                            return rows[0] || null;
                                                        } catch (err) {
                                                            console.error(err);
                                                            throw err;
                                                        } finally {
                                                            if (conn) conn.release();
                                                        }
                                                    }

                                                    async save(student) {
                                                        let conn;
                                                        try {
                                                            conn = await pool.getConnection();
                                                            const existingStudent = await this.findById(student.id);
                                                            if (existingStudent) {
                                                                // Update existing student
                                                                await conn.query(
                                                                    'UPDATE students SET name = ?, login = ?, password = ?, role = ?, status = ?, teacher_id = ? WHERE id = ?',
                                                                    [
                                                                        student.name,
                                                                        student.login,
                                                                        student.password,
                                                                        student.role,
                                                                        student.status,
                                                                        student.teacherId,
                                                                        student.id,
                                                                    ]
                                                                );
                                                            } else {
                                                                // Insert new student
                                                                const result = await conn.query(
                                                                    'INSERT INTO students (name, login, password, role, status, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
                                                                    [
                                                                        student.name,
                                                                        student.login,
                                                                        student.password,
                                                                        student.role,
                                                                        student.status,
                                                                        student.teacherId,
                                                                    ]
                                                                );
                                                                student.id = Number(result.insertId); // Convert BigInt to Number
                                                            }
                                                            return student; // Return the full student object
                                                        } catch (err) {
                                                            console.error(err);
                                                            throw err;
                                                        } finally {
                                                            if (conn) conn.release();
                                                        }
                                                    }
                                                }

                                                module.exports = StudentRepository;