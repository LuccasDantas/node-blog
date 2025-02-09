const express = require('express')
const router = express.Router()                                     //Permite criar rotas
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const { Where } = require('sequelize/lib/utils')
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]                                //Incluindo o model Category
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories})
    })
})

router.post("/articles/save" , adminAuth, (req, res) => { 
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id
    if(id != undefined){ 

        if(!isNaN(id)){   //is number?

            Article.destroy({
                where: {
                    id:id
                }
            }).then( () => {
                res.redirect("/admin/articles")
            })

        }else{   // NÃO FOR UM NÚMERO
            res.redirect("admin/articles")
        }
    }else{      //NULL
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id

    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                    res.render("admin/articles/edit", {categories: categories, article: article})
            })

        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })  
})


// ROTA PARA A ATUALIZAÇÃO DOS CAMPOS DO DATABASE

router.post("/articles/update", adminAuth, (req, res) => {

    // Informações p/ fazer o Update
    var id = req.body.ID
    var title = req.body.title
    var body = req.body.body
    var categoryId = req.body.category


    // Model de artigos para Update
    // Abrindo em JSON '{}'
    // Atualizamos o slug com o Slugify baseado no NOVO 'title'
    Article.update({

        title: title, 
        body: body, 
        categoryId: categoryId, 
        slug: slugify(title),
        }, 
        
        {
        where: {
            id: id
        }
        
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/")
    })

})

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0


    if(isNaN(page) || page == 1) {
        offset = 0
    }else {
        offset = (parseInt(page) - 1) * 4   //parseInt p/ converter valor de texto em númerico
    }
    

    //Pesquisa todos os elementos no banco de dados e informa quantos elementos tem
    Article.findAndCountAll({

        //Definindo o limite de pages
        limit: 4,

        //Retornar dados a partir de um valor (Conforme a página)
        offset: offset,
        order: [
            ["id", "DESC"]
        ],

    }).then(articles => {

        var next
        if(offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }


        // Verificando se existe outra página
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }


        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})

        })

    })              

})

module.exports = router
