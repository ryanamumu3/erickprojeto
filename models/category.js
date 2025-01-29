const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('Category', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
  },
});

module.exports = Category;
