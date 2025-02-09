const Sequelize = require("sequelize")  // Conexão com o banco de dados
const connection = require("../database/database") // Importando o script de conexão com o Db

const Category = connection.define('categories', {
    
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Category