'use strict'

//VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const usuario_rutas = require('./src/rutas/usuario.rutes')
const curso_rutas = require('./src/rutas/curso.rutes')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api', usuario_rutas,curso_rutas)


//EXPORTAR
module.exports = app