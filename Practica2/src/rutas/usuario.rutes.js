'use strict'

const express = require("express");
const usuarioControlado = require('../controler/usuario.controller');
const alumnoControlado = require('../controler/alumno.controller');
const md_autentication = require('../middlewares/authenticated');


var api = express.Router();
//rutas de alumnos
api.post('/registrarAlumno', alumnoControlado.registrar);
api.put('/asignarCursos/:idCurso1', md_autentication.ensureAuth, alumnoControlado.asignar)
api.put('/editarAlumno', md_autentication.ensureAuth, alumnoControlado.editar)
api.get('/obtenerCursos', md_autentication.ensureAuth, alumnoControlado.obtener)
api.delete('/eliminarAlumno', md_autentication.ensureAuth, alumnoControlado.eliminar)
api.get('/pdfAlumno', md_autentication.ensureAuth, alumnoControlado.pdfAlumno)
//rutas de usuarios
api.post('/login', usuarioControlado.login);
api.post('/registrarUsuario', md_autentication.ensureAuth, usuarioControlado.registrar);






module.exports = api;