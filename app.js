//Carregando modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const handlebarsCreate = handlebars.create({
        defaltLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    })
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    const res = require('express/lib/response')
    const req = require('express/lib/request')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)
    const db = require('./config/db')

//configurações
    //Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null;
        next();
    })
    //body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars', handlebarsCreate.engine)
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI).then(() =>{
            console.log('Conectado ao mongo')
        }).catch((err) => {
            console.log('Erro ao se connectar' + err)
        })
    //Public
        app.use(express.static(path.join(__dirname, 'public')))
        // app.use((req, res, next)=>{
        //     console.log('oi eu sou um middleWare')
        //     next();
        // })
//Rotas
    app.get('/', (req, res) => {
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash('erro_msg', "Houve um erro interno!")
            res.redirect('/404')
        })
        
    })
    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('error_msg', 'Essa Postagem não existe!')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
    })
    })
    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })
    app.get('/categorias', (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg','Houve um erro interno ao acessar a categoria')
            res.redirect('/')
            
        })
        
    })
    app.get('/categorias/:slug',(req, res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens) => {

                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})

                }).catch((err) => {

                    req.flash('error_msg', 'Houve um erro ao listar os posts')
                    res.redirect('/')

                })
            }else{
                console.log(error)
                req.flash('error_msg', 'Essa categoria não existe!')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao procurar a categoria!')
            res.redirect('/')
        })
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

//Outros
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log('Servidor ligado com Sucesso!')
})