
    const HomeworkRepository = require('../../repository/HomeworkRepository');

    class HomeworkServicedb {
        constructor(homeworkRepository = new HomeworkRepository()) {
            this.homeworkRepository = homeworkRepository;
        }


        async save(homework) {
            return await this.homeworkRepository.save(homework);
        }


        async findById(id) {
            const homework = await this.homeworkRepository.findById(id);
            if (!homework) {
                throw new Error(`Homework with ID ${id} not found`);
            }
            return homework;
        }


        async findAll() {
            return await this.homeworkRepository.findAll();
        }


        async deleteById(id) {
            const deleted = await this.homeworkRepository.deleteById(id);
            if (!deleted) {
                throw new Error(`Homework with ID ${id} not found`);
            }
            return deleted;
        }


        async deleteAll() {
            return await this.homeworkRepository.deleteAll();
        }
    }

    module.exports = HomeworkServicedb;