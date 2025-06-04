const pool = require('../db');

                    class StudentResponseRepository {
                        async findResponsesByStudentAndHomework(studentId, homeworkId) {
                            let conn;
                            try {
                                conn = await pool.getConnection();
                                return await conn.query(
                                    'SELECT * FROM student_responses WHERE student_id = ? AND homework_id = ?',
                                    [studentId, homeworkId]
                                );
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
                                const query = `
                                    SELECT sr.*,
                                           h.name_homework, h.task, h.description, h.deadline, h.upload_time,
                                           s.name
                                    FROM student_responses sr
                                             JOIN homeworks h ON sr.homework_id = h.id
                                             JOIN students s ON sr.student_id = s.id
                                `;
                                return await conn.query(query);
                            } catch (err) {
                                console.error(err);
                                throw err;
                            } finally {
                                if (conn) conn.release();
                            }
                        }
                        async findAllResponsesByStudent(studentId) {
                            let conn;
                            try {
                                conn = await pool.getConnection();
                                const query = `
                                    SELECT sr.*, h.name_homework, h.task, h.description, h.deadline, h.upload_time, s.name
                                    FROM student_responses sr
                                             JOIN homeworks  h ON sr.homework_id = h.id
                                             JOIN students s ON sr.student_id = s.id
                                    WHERE sr.student_id = ?
                                `;
                                return await conn.query(query, [studentId]);
                            } finally {
                                if (conn) conn.release();
                            }
                        }
                        async findByStudentAndHomework(studentId, homeworkId) {
                            let conn;
                            try {
                                conn = await pool.getConnection();
                                const query = `
                                    SELECT * FROM student_responses
                                    WHERE student_id = ? AND homework_id = ?
                                `;
                                return await conn.query(query, [studentId, homeworkId]);
                            } catch (err) {
                                console.error(err);
                                throw err;
                            } finally {

                                if (conn) conn.release();
                            }
                        }
                        async save(studentResponse) {
                            let conn;
                            try {
                                conn = await pool.getConnection();
                                const existingResponse = await this.findResponsesByStudentAndHomework(
                                    studentResponse.student_id, studentResponse.homework_id
                                );
                                if (existingResponse.length > 0) {
                                    await conn.query(
                                        'UPDATE student_responses SET response_text = ?, mark = ?, response_time = ? WHERE student_id = ? AND homework_id = ?',
                                        [
                                            studentResponse.response_text,
                                            studentResponse.mark,
                                            studentResponse.response_time,
                                            studentResponse.student_id,
                                            studentResponse.homework_id,
                                        ]
                                    );
                                } else {
                                    const result = await conn.query(
                                        'INSERT INTO student_responses (student_id, homework_id, response_text, mark, response_time) VALUES (?, ?, ?, ?, ?)',
                                        [
                                            studentResponse.student_id,
                                            studentResponse.homework_id,
                                            studentResponse.response_text,
                                            studentResponse.mark,
                                            studentResponse.response_time,
                                        ]
                                    );
                                    studentResponse.id = Number(result.insertId);
                                }
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
                                await conn.query('DELETE FROM student_responses');
                            } catch (err) {
                                console.error(err);
                                throw err;
                            } finally {
                                if (conn) conn.release();
                            }
                        }

                        async deleteByStudentAndHomework(studentId, homeworkId) {
                            let conn;
                            try {
                                conn = await pool.getConnection();
                                const result = await conn.query(
                                    'DELETE FROM student_responses WHERE student_id = ? AND homework_id = ?',
                                    [studentId, homeworkId]
                                );
                                return result.affectedRows > 0;
                            } catch (err) {
                                console.error(err);
                                throw err;
                            } finally {
                                if (conn) conn.release();
                            }
                        }

                        async update(studentResponse, changes) {
                            let conn;
                            try {
                                conn = await pool.getConnection();
                                const result = await conn.query(
                                    'UPDATE student_responses SET response_text = ?, response_time = ? WHERE student_id = ? AND homework_id = ?',
                                    [
                                        changes.response_text,
                                        changes.response_time,
                                        changes.homework_status,
                                        studentResponse.student_id,
                                        studentResponse.homework_id
                                    ]
                                );
                                console.log(result);
                                return result.affectedRows > 0;
                            } catch (err) {
                                console.error(err);
                                throw err;
                            } finally {
                                if (conn) conn.release();
                            }
                        }
                    }

                    module.exports = StudentResponseRepository;