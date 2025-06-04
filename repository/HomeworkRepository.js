const pool = require('../db');

                            class HomeworkRepository {

                                async findById(id) {
                                    let conn;
                                    try {
                                        conn = await pool.getConnection();
                                        const rows = await conn.query('SELECT * FROM homeworks WHERE id = ?', [id]);
                                        return rows[0] || null;
                                    } catch (err) {
                                        console.error(err);
                                        throw err;
                                    } finally {
                                        if (conn) conn.release();
                                    }
                                }

                                // Find all homework records
                                async findAll() {
                                    let conn;
                                    try {
                                        conn = await pool.getConnection();
                                        return await conn.query('SELECT * FROM homeworks');
                                    } catch (err) {
                                        console.error(err);
                                        throw err;
                                    } finally {
                                        if (conn) conn.release();
                                    }
                                }


                                async save(homework) {
                                    let conn;
                                    try {
                                        conn = await pool.getConnection();
                                        const existingHomework = await this.findById(homework.id);
                                        if (existingHomework) {

                                            await conn.query(
                                                'UPDATE homeworks SET name_homework = ?, task = ?, description = ?, upload_time = ?, deadline = ?, teacher_id = ? WHERE id = ?',
                                                [
                                                    homework.name_homework,
                                                    homework.task,
                                                    homework.description,
                                                    homework.upload_time,
                                                    homework.deadline,
                                                    homework.teacher_id,
                                                    homework.id,
                                                ]
                                            );
                                        } else {

                                            const result = await conn.query(
                                                'INSERT INTO homeworks (name_homework, task, description, upload_time, deadline, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
                                                [
                                                    homework.name_homework,
                                                    homework.task,
                                                    homework.description,
                                                    homework.upload_time,
                                                    homework.deadline,
                                                    homework.teacher_id,
                                                ]
                                            );
                                            homework.id = Number(result.insertId);
                                        }
                                        return homework;
                                    } catch (err) {
                                        console.error(err);
                                        throw err;
                                    } finally {
                                        if (conn) conn.release();
                                    }
                                }


                                async deleteById(id) {
                                    let conn;
                                    try {
                                        conn = await pool.getConnection();
                                        const result = await conn.query('DELETE FROM homeworks WHERE id = ?', [id]);
                                        return result.affectedRows > 0;
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
                                        await conn.query('DELETE FROM homeworks');
                                    } catch (err) {
                                        console.error(err);
                                        throw err;
                                    } finally {
                                        if (conn) conn.release();
                                    }
                                }
                            }

                            module.exports = HomeworkRepository;