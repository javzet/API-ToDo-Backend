const mongoose = require('mongoose');

let roles_validos = {
    values: ['ADMINMUYINDESCIFRABLEJAJASALU2_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es requerido']},
    email: {type: String, required: [true, 'El correo electrónico es requerido'], unique: true},
    password: {type: String, required: [true, 'La contraseña es requerida']},
    rol: {type: String, default: 'USER_ROLE', enum: roles_validos}
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    //delete userObject.password;

    return userObject;
};

module.exports = mongoose.model('Usuario', usuarioSchema);