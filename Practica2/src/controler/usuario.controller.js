'use strict'

const bcrypt = require("bcrypt-nodejs");
const { findByIdAndDelete } = require("../modules/usuario.model");
const usuarioModel = require('../modules/usuario.model');
const jwt = require('../servicios/jwt')
const maestro = 'maestro';

//solo podra registrar usuarios maestros los estudiantes se logean solos
function registrar(req,res){
    if (req.user.rol === maestro){
        var usuario = new usuarioModel();
    var params = req.body;
    if(params.usuario && params.password && params.rol && params.nombre && params.apellido){
        usuario.usuario = params.usuario;
        usuario.password = params.password;
        usuario.rol = maestro;
        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;

        usuarioModel.find({usuario: usuario.usuario}).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de usuario'})
            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return res.status(200).send({mensaje:'El usuario Admin ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                    usuario.password = passwordEncriptada;

                    usuario.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Erros al guardar el usuario'})

                        if (usuarioGuardado){
                           return res.status(200).send(usuarioGuardado)
                        }else{
                           return res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario'})
                        }
                    })
                })
            }
        })
    }
    }else{
        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'})
    }
    
}

//Creara un Token deacuerdo al rol que tenga
function login(req,res){
    var params = req.body;
    
    usuarioModel.findOne({$and:[
        { usuario: params.usuario},
        { rol: {$regex: params.rol, $options: 'i'}}
    ]}, (err,usuarioLocalizado)=>{
        if(err) return res.status(404).send({mensaje: 'Error en la peticion de Login'})

        if(usuarioLocalizado){
            bcrypt.compare(params.password, usuarioLocalizado.password, (err, Valido)=>{
                if (err)  return res.status(500).send({ mensaje: 'Error en la contraseña'})

                if(Valido){
                    var constancia = params.rol;
                    
                        return res.status(200).send({
                            token: jwt.createToken(usuarioLocalizado)
                        });
                    
                }else{
                    return res.status(404).send({mensaje: 'El usuario no se pudo identificar'})
                }
            })
        }else{
            return res.status(404).send({mensaje:'El usuario no ha podido ingresar'})
        }
    })


}



module.exports = {
    registrar,
    login
}