// Express
const express = require('express');
const app = express();

// JWT
const jwt = require('jsonwebtoken');

// Comprobar contraseña
const bcrypt = require('bcrypt');

// Modelos
const Usuario = require('../models/usuario');

// Login 
app.post( '/api/v1/login', ( req, res ) => {

    let body = req.body;

    Usuario.findOne( {email: body.email}, (err, usuario) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El [coreo] y/o la contraseña son incorrectos'
                }
            });
        }

        if ( !bcrypt.compareSync( body.password, usuario.password ) ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El correo y/o la [contraseña] son incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

        res.json({
            ok: true,
            usuario,
            token
        });
    });

});

module.exports = app;