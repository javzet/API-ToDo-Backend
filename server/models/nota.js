// Mongoose
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let notaSchema = new Schema({
    titulo: { type: String, required: [ true, 'El titulo de la nota es necesario' ] },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model( 'Nota', notaSchema );