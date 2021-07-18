'use strict'

const alumno = 'alumno';
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');
const Usuario = require('../modules/usuario.model');

const pdf = require("html-pdf")
//PROFE el pdf mejorara en el proyecto del domingo
function pdfAlumno(req,res){
    var idAlumno = req.user.sub;
    Usuario.findOne({_id : idAlumno}).populate('cursos').exec((err,cursosCursados)=>{
            const contenido = `
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>PDF</title>
            </head>
            <body>
            <h2>${cursosCursados.nombre}</h2>
            <h2>${cursosCursados.apellido}</h2>
            <h2>${cursosCursados.carnet}</h2>
            <table border=1>
            <tbody>
            <tr>
            <th>Cursos</th>
            <th></th>
            </tr>
            <tr>
            <th>${cursosCursados.cursos[0]}</th>
            </tr>
            <tr>
            <th>${cursosCursados.cursos[1]}</th>
            </tr>
            <tr>
            <th>${cursosCursados.cursos[2]}</th>
            </tr>
            </tbody>
            </table>
            </body>
            </html>
            `;

            pdf.create(contenido).toFile('./src/pdf/alumno.pdf', function (err,listo) {
                if (err){
                  return  res.status(200).send(err)
                }else{
                   return res.status(200).send(listo)
                }

            })
    })
}


//registra al alumno y automaticamente tendra el usuario creado
//el Usuario es el nombre de la persona
//la contraseña es el apellido de la persona
function registrar(req,res){
    var usuarioModel = new Usuario();
    var params = req.body;
    if(params.nombre && params.apellido && params.carnet){
        usuarioModel.nombre = params.nombre;
        usuarioModel.apellido = params.apellido;
        usuarioModel.carnet = params.carnet;
        usuarioModel.usuario = params.nombre;
        usuarioModel.rol= alumno;

        Usuario.find({carnet: params.carnet}).exec((err, alumnoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de alumno'})
            if(alumnoEncontrado && alumnoEncontrado.length >= 1){
                return res.status(404).send({mensaje:'El alumno ya existe'})
            }else{
                bcrypt.hash(params.apellido, null, null,(err,passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save(); 
                    return res.status(200).send({mensaje: 'Se creo el usuario del alumno '})
                })
            }
        })        
    }
}

//tiene todas las verificaciones de numero de cursos y que no se repitan los cursos
//el recorrido de los arrays en javaScript es nuevo para mi, entonces lo hice de una manera un poco rustica
function asignar(req,res){
    var idCurso1 = req.params.idCurso1;
    var idAlumno = req.user.sub;
    var usuarioModel = new Usuario();
    var rol = req.user.rol;
    if(rol == alumno){
        Usuario.findOne({_id : idAlumno}).exec((err,alumnoEncontrado)=>{
            if(alumnoEncontrado.cursos.length < 3){
                for (let i = 0; i < alumnoEncontrado.cursos.length; i++) {
                   if(alumnoEncontrado.cursos[i] == idCurso1){
                    return res.status(500).send({mensaje:'Ya esta asignada esta clase'})
                   }
                }
                Usuario.findOneAndUpdate({
                    _id: idAlumno
                    },{
                    $push:{
                    cursos: idCurso1
                    }
                    },(err,alumnoActualizado)=>{
                    return res.status(500).send(alumnoActualizado)
                    })
            }else{
                return res.status(404).send({mensaje:'ya tiene tres cursos asignados'})
            }
        })
    } else{
        return res.status(404).send({mensaje:'Usted es maestro'})
    }  
}

//obtendra los cursos que se asigno el alumno logueado
function obtener(req,res){
    var idAlumno = req.user.sub;
    var rol = req.user.rol;
    if(rol === alumno){
        Usuario.find({_id : idAlumno}).populate('cursos').exec((err,cursosCursados)=>{
            return res.status(200).send(cursosCursados) 
     })
    }else{
        return res.status(404).send({mensaje:'Usted es maestro'})
    }
    
}


function editar(req,res){
    //falta todavia
    var idAlumno = req.user.sub;
    var params = req.body;
    var rol = req.user.rol;
    delete params.usuario;
    delete params.password;
    delete params.rol;
    if(rol===alumno){
        Usuario.findByIdAndUpdate(idAlumno, params ,{new:true},(err,alumnoActualizado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
            if(!alumnoActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el Alumno'});
            return res.status(200).send({alumnoActualizado})
        })
    }else{
        return res.status(404).send({mensaje:'Usted es maestro'})
    }
}
//elimina el alumno que se logueo
function eliminar(req,res){
    var idAlumno = req.user.sub;
    if(req.user.rol==alumno){
        Usuario.findByIdAndDelete(idAlumno,(err, alumnoEncontrado)=>{
            if(alumnoEncontrado) return res.status(200).send({mensaje: 'Alumno Eliminado'});
        })
    }else{
        return res.status(404).send({mensaje:'Usted es maestro'})
    }
    
}



module.exports = {
    registrar,
    asignar,
    obtener,
    editar,
    eliminar,
    pdfAlumno
}



/*
if(alumnoEncontrado.cursos[2] == idCurso1){
    return console.log('Ya esta asignada esta clase')
}else{
       Usuario.findOneAndUpdate({
_id: idAlumno
},{
$push:{
cursos: idCurso1
}
},(err,alumnoActualizado)=>{
return console.log(alumnoActualizado)
})
}*/