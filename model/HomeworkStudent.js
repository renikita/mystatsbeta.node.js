
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class HomeworkStudent extends Model {}

HomeworkStudent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        homeworkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'homework',
                key: 'id',
            },
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'HomeworkStudent',
        tableName: 'homework_students',
    }
);

module.exports = HomeworkStudent;