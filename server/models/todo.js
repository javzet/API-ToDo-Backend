// Declaración mongoose
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Crear Schema
let todoSchema = new Schema({
    todo: { type: String, required: [ true, 'El nombre de la lista es necesario' ] },
    completed: { type: Boolean, required: [ true, 'El campo checked es necesario' ], default: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model( 'Todo', todoSchema );