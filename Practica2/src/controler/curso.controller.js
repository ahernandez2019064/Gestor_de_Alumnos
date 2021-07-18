'use strict'
const { deleteOne } = require('../modules/cursos.model');
//Este CRUD solo sera valido para Maestros
const Cursos = require('../modules/cursos.model');
const Alumnos = require('../modules/usuario.model')
const maestro = 'maestro';

//El curso solo se podra agregar si el rol del usuario es maestro, y tendra una referencia del profesor que creo el curso
function registrar(req,res){
    var cursosModel = new Cursos();
    var params = req.body;

    if(req.user.rol ===maestro){
            if (params.nombre){
                cursosModel.nombre = params.nombre;
                cursosModel.profesor = req.user.sub;
                cursosModel.save((err,cursoGuardado)=>{
                    if(err) return res.status(404).send({mensaje: 'Error al guardar el curso'});

                        if(cursoGuardado){
                            return res.status(200).send(cursoGuardado)
                        }else{
                            return res.status(404).send({mensaje:'No se pudo guardar el curso'})
                        }
                })
            }
    }else{
        res.status(404).send({mensaje: 'Usted no tiene los permisos necesarios'})
    }
}

//solo se editara si el maestro que agrego el curso es el mismo que lo quiere editar
function editar(req,res){
    var idCurso = req.params.idCurso;
    var params = req.body;
    Cursos.findById(idCurso, (err,cursoEncontrado)=>{
        if(err) return res.status(400).send({mensaje: 'Error en la petición de busqueda'})
        if(cursoEncontrado){
            if(cursoEncontrado.profesor == req.user.sub){
                Cursos.update(cursoEncontrado, params, {new:true}, (err,cursoActualizado)=>{
                    if(err) return res.status(501).send({mensaje: 'Error en la petición'});
                    if(!cursoActualizado) return res.status(500).send({mensaje: 'No se pudo actualizar el curso'})
                    return res.status(500).send({mensaje: 'El Curso '+ cursoEncontrado.nombre + ' fue actualizado'})
                })
            }else{
                return res.status(500).send({mensaje:'El curso no le pertenece'})
            }
        }
    })
}

//solo se eliminara si el maestro que agrego el curso es el mismo que lo quiere editar y los alumnos que tengan ese 
//curso se les cambiara al id del curso por defecto 
function eliminar(req,res){
    var idCurso = req.params.idCurso;
    var posicion
    Cursos.findOne({nombre:"defecto"},(err,defectoEncontrado)=>{
    Cursos.findById(idCurso, (err,cursoEncontrado)=>{
        if(cursoEncontrado){
            
        if(cursoEncontrado.profesor == req.user.sub){
            Cursos.deleteOne(cursoEncontrado, (err,cursoEliminado)=>{
                Alumnos.find({cursos:idCurso}).exec((err,alumnosEncontrados)=>{
                    alumnosEncontrados.forEach((nuevoCurso)=>{
                        posicion = nuevoCurso.cursos.indexOf(idCurso);
                        nuevoCurso.cursos[posicion] = defectoEncontrado._id;
                        let data = nuevoCurso.cursos;
                        defaultUsuario(nuevoCurso._id, data).then((arrayEliminado)=>{
                        })
                        
                    })
            
                })   
                if(err) return res.status(501).send({mensaje: 'Error en la petición'});
                return res.status(200).send({
                    cursoEncontrado,
                    mensaje: 'Curso Eliminado'
                })                
            })
        }else{
            return res.status(500).send({mensaje:'El curso no le pertenece'})
        }
        }else{
            
            
                return res.status(500).send({mensaje:'No se encontro el curso'})
            
        }
    })
})
}

//funcion para editar el curso eliminado
async function defaultUsuario(id, cursos){
        return await Alumnos.findByIdAndUpdate(id, { $set:{cursos}}).then((datos)=>{
            
        })
}

//mostrara los cursos del maestro logueado
function mostrar(req,res){
    var idMaestro = req.user.sub;

    Cursos.find({profesor:idMaestro}, (err,cursosEncontrados)=>{
        if(err) return res.status(404).send({mensaje:'Error en la peticion Mostrar'})
        return res.status(200).send(cursosEncontrados);
        
    })
  
    
}

module.exports = {
    registrar,
    editar,
    eliminar,
    mostrar
}

/*
Alumnos.find().exec((err,alumnosEncontrados)=>{
    for (let alumnos = 0; alumnos < alumnosEncontrados.length; alumnos++) {
         for (let i = 0; i < alumnosEncontrados[alumnos].cursos.length; i++) {
             if(idCurso == alumnosEncontrados[alumnos].cursos[i]){
                 var variable = alumnosEncontrados[alumnos];
                 var defaulto = 'Defaulto'
                 Alumnos.update(variable, defaulto, {new:true}, (err,actualizado)=>{
                     console.log(actualizado)
                 })
             }   
         }
    }   
 })   */
