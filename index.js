const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const session = require("express-session")   //Sessões
const connection = require('./database/database')


//Controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require("./users/UsersController")

//Models
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")


// view engine
app.set('view engine', 'ejs')


//Configurando sessões
app.use(session({
    //Texto aleatório p/ a seguraçança das sessões
    secret: "djsaodjsaodjassoidjsaoijfoihgrhghrf", cookie: {maxAge: 30000000}  
}))


// Static
app.use(express.static('public'))
// Body parser
app.use(bodyParser.urlencoded({ extended: false }))
// Aceitar dados do formato json
app.use(bodyParser.json())
// Definindo o uso do nosso Controller dos Usuários
app.use("/", usersController)


app.get("/session", (req,res) => {
    req.session.treinamento = "Formação Node.js"
    req.session.ano = "2024"
    req.session.email = "luccasfluminense@gmail.com"
    req.session.user = {
        username: "Luccas Octávio",
        email: "luccasfluminense@gmail.com",
        id: 10
    }
    res.send("Sessão criada")
})

app.get("/leitura", (req, res) => { 
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})


// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!")
    }).catch((error) => {
        console.log(error)
    })

// Sincronizando o banco de dados
connection.sync({ force: false }).then(() => {
    console.log('Sincronização do banco de dados bem-sucedida');

// ROTAS
app.use("/", categoriesController)
app.use("/", articlesController)

// Renderização da homepage
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
            ],
            limit: 4
        }).then(articles => {
            Category.findAll().then(categories => {
                res.render("index", { articles: articles, categories: categories })
            })
        })
    })


app.get("/:slug", (req, res) => {
        var slug = req.params.slug
        Article.findOne({
            where: {
                slug: slug
            }
        }).then(article => {
            if (article != undefined) {
                Category.findAll().then(categories => {
                    res.render("article", { article: article, categories: categories })
                })
            } else {
                res.redirect("/")
            }
        }).catch(err => {
            res.redirect("/")
        })
    })


app.get("/category/:slug", (req, res) => {
        var slug = req.params.slug
        Category.findOne({
            where: {
                slug: slug
            },
            include: [{ model: Article }]
        }).then(category => {
            if (category != undefined) {
                Category.findAll().then(categories => {
                    res.render("index", { articles: category.articles, categories: categories })
                })
            } else {
                res.redirect("/")
            }
        }).catch(err => {
            res.redirect("/")
        })
    })

// Conexão
app.listen(8990, () => {
    console.log("O servidor está rodando!")
    })
}).catch(error => {
    console.log('Erro ao sincronizar o banco de dados:', error);
});
