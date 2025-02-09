const Sequelize = require("sequelize")  // Conexão com o banco de dados
const connection = require("../database/database") // Importando o script de conexão com o Db
const Category = require("../categories/Category")   // Importando o model Category 

const Article = connection.define('articles', {
    
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },

    body: {                         // Conteúdo do artigo (texto longo)
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)       // Uma categoria tem muitos artigos
Article.belongsTo(Category)     // Um artigo pertence a uma categoria

module.exports = Article