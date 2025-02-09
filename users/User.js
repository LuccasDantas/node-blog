const Sequelize = require("sequelize")  // Conexão com o banco de dados
const connection = require("../database/database") // Importando o script de conexão com o Db

const User = connection.define('users', {
    
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

// force true é para recriar a tabela assim que iniciar a aplicação


module.exports = User