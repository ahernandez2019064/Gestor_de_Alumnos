'use strict'

const mongoose = require("mongoose");
const usuarioModel = require('./src/modules/usuario.model');
const cursoModel = require('./src/modules/cursos.model')
const bcrypt = require("bcrypt-nodejs");
const app = require('./app')

mongoose.Promise = global.Promise;
//Crea por defecto un usuario Maestro y un curso por defecto
mongoose.connect('mongodb://localhost:27017/ControlAlumnos', {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    var user = 'MAESTRO';
    var password = '123456';
    var rol = 'maestro';
    var Defecto = 'defecto';
    var usuario = new usuarioModel();
    var curso = new cursoModel();

    curso.nombre = Defecto;
    usuario.usuario = user;
    usuario.password = password;
    usuario.rol = rol;


    usuarioModel.find({usuario: usuario.usuario}).exec((err, usuarioEncontrado)=>{
        if(usuarioEncontrado && usuarioEncontrado.length >=1){
            console.log('Usuario Ya existe') 
        }else{
            bcrypt.hash(usuario.password, null, null, (err, passwordEncriptada)=>{
                usuario.password = passwordEncriptada;
                
                usuario.save((err, usuarioGuardado)=>{
                    if(err) return console.log('Error al guardar')
                    
                    if (usuarioGuardado){
                        return   console.log(usuarioGuardado) 
                    }else{
                        return    console.log('Erro catastrofico')
                        }
                })
                }) 
        }
        cursoModel.find({nombre: curso.nombre}).exec((err,cursoEncontrado)=>{
            if(cursoEncontrado && cursoEncontrado.length >=1){
                  console.log('curso ya existe')    
            }else{ 
                curso.save((err,guardar)=>{
                    if(guardar)  console.log(guardar) 
                });
            }
        })
    })
    app.listen(3000,function(){
        console.log('El servidor esta corriendo')
    })     
}).catch(err => console.log(err))