const pool = require('../db');

                        class TeacherRepository {
                            async findByLogin(login) {
                                let conn;
                                try {
                                    conn = await pool.getConnection();
                                    const rows = await conn.query('SELECT * FROM teachers WHERE login = ?', [login]);
                                    return rows[0]; // Return the first result
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
        await conn.query('DELETE FROM teachers');
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}
                            async findById(id) {
                                let conn;
                                try {
                                    conn = await pool.getConnection();
                                    const rows = await conn.query('SELECT * FROM teachers WHERE id = ?', [id]);
                                    return rows[0]; // Return the first result
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                } finally {
                                    if (conn) conn.release();
                                }
                            }

                            async save(teacher) {
                                let conn;
                                try {
                                    conn = await pool.getConnection();
                                    if (teacher.id) {
                                        // Update existing teacher
                                        const query = `
                                            UPDATE teachers
                                            SET task = ?, login = ?, name = ?, password = ?, role = ?, status = ?
                                            WHERE id = ?
                                        `;
                                        const params = [
                                            teacher.task,
                                            teacher.login,
                                            teacher.name,
                                            teacher.password,
                                            teacher.role,
                                            teacher.status,
                                            teacher.id
                                        ];
                                        await conn.query(query, params);
                                    } else {
                                        // Insert new teacher
                                        const query = `
                                            INSERT INTO teachers (task, login, name, password, role, status)
                                            VALUES (?, ?, ?, ?, ?, ?)
                                        `;
                                        const params = [
                                            teacher.task,
                                            teacher.login,
                                            teacher.name,
                                            teacher.password,
                                            teacher.role,
                                            teacher.status
                                        ];
                                        const result = await conn.query(query, params);
                                        teacher.id = Number(result.insertId); // Convert BigInt to Number
                                    }
                                    return teacher; // Return the full teacher object
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                } finally {
                                    if (conn) conn.release();
                                }
                            }

                            async addStudents(teacherId, studentIds) {
                                let conn;
                                try {
                                    conn = await pool.getConnection();
                                    const query = `
            UPDATE students
            SET teacher_id = ?
            WHERE id IN (${studentIds.map(() => '?').join(',')})
        `;
                                    const params = [teacherId, ...studentIds];
                                    await conn.query(query, params);
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                } finally {
                                    if (conn) conn.release();
                                }
                            }
                        }

                        module.exports = TeacherRepository;