'use strict'

const express = require("express");
const cursoControlador = require('../controler/curso.controller');
const md_autentication = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarCurso', md_autentication.ensureAuth, cursoControlador.registrar)
api.put('/editarCurso/:idCurso', md_autentication.ensureAuth, cursoControlador.editar)
api.put('/eliminarCurso/:idCurso', md_autentication.ensureAuth, cursoControlador.eliminar)
api.get('/mostrarCursos',md_autentication.ensureAuth ,cursoControlador.mostrar)


module.exports = api;