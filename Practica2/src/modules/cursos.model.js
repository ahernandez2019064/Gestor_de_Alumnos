'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CursoSchema = Schema({
    nombre: String,
    profesor: {type:Schema.Types.ObjectId, ref:'Usuarios'}
})

module.exports = mongoose.model('Cursos', CursoSchema);