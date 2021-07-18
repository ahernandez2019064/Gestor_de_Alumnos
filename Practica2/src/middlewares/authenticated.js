'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '@lb2_taller';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        returnres.status(401).send({ mensaje: 'Llene la autorización con el token'});
    }

    var token = req.headers.authorization.replace(/['"']+/g, '');

    try{
        var payload = jwt.decode(token, secret)

        if(payload.exp <= moment().unix()){
            return res.status(401).send({ mensaje: 'El token ha expirado'});
        }
    }catch(error){
        return res.status(404).send({
            mensaje: 'El token no es valido'
        })
    }
req.user= payload;
next();
}