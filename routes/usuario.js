const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcryptjs = require('bcryptjs')
const bcrypt = require('bcryptjs/dist/bcrypt')
require
const passport = require('passport')
const flash = require('connect-flash/lib/flash')

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req, res) =>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome invalido!'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: 'Email invalido!'})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha invalida!'})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: 'Senha muito curta!'})
    }

    if(req.body.senha.length > 15){
        erros.push({texto: 'Senha muito grande!'})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'Senhas não são iguais!'})
    }

    if(erros.length > 0){
        res.render('usuarios/registro', ({erros: erros}))
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash('error_msg', 'Já existe uma conta com esse email!')
                res.redirect('/usuarios/registro')
            }else{

                bcryptjs.genSalt(10, (erro, salt) => {
                    bcryptjs.hash(req.body.senha, salt, (erro, hash) => {
                        if(erro){
                            console.log(erro)
                            req.flash('error_msg', 'Houve um erro durante o salvamente do usuario')
                            res.redirect('/')
                        }
                            const novoUsuario = {
                                nome: req.body.nome,
                                email: req.body.email,
                                senha: hash
                            }

                            new Usuario(novoUsuario).save().then(() => {
                                req.flash('success_msg', 'Cadastro efetuado com sucesso!')
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash('error_msg', 'Houve um erro ao se cadastrar!')
                                res.redirect('/usuarios/registro')
                            })





                    })
                })
                // var salt = bcrypt.genSaltSync(10)
                // var hash = bcrypt.hashSync(req.body.senha, salt)


                

                



            }
        }).catch((err) =>{
            req.flash('error_msg', 'houve um erro interno!')
            res.redirect('/')
        })

    }


})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/usuarios/login',
            failureFlash: true
        })(req, res, next)
})

router.get('/logout' ,(req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect('/')
})

module.exports = router