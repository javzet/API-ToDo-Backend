// Express
const express = require('express');
const app = express();

// Encriptar contraseña
const bcrypt = require('bcrypt');

// Modelo
const Usuario = require('../models/usuario');

// Middleware
const { verificaAdminRol, verificaToken } = require('../middlewares/autenticacion');

// Underscore para update
const _ = require('underscore');

// JSONWebToken
const jwt = require('jsonwebtoken');

// Listar todos los usuarios - Admin
app.get( '/api/v1/usuario', [ verificaToken, verificaAdminRol ], ( req, res ) => {
    let f = req.query.f || 0;
    let t = req.query.t || 5;

    f = Number(f);
    t = Number(t);

    Usuario.find()
        .skip(f)
        .limit(t)
        .exec((err, usuario) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario
            })
        });
});

// Obtener Usuario por ID - Admin
app.get( '/api/v1/usuario/:id', [ verificaToken, verificaAdminRol ], ( req, res ) => {

    let id = req.params.id;

    if (!id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID del usuario es necesario'
            }
        });
    }

    Usuario.findById(id, (err, usuario) => {

        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `El usuario con ID ${ id } no existe`
                }
            });
        }

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        })
    });

});

// Obtener mi información
app.get( '/api/v1/me', [ verificaToken ], ( req, res ) => {

    let id = req.usuario._id;

    if ( !id ) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Ha ocurrido un problema al ejecutar la aplicación, por favor contacte al programador. [ User::GET::If!ID ]'
            }
        });
    }

    Usuario.findById( id, ( err, usuario ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        });
    });

});

// Crear Usuario
app.post( '/api/v1/usuario', ( req, res ) => {

    let body = req.body;
    console.log(req.body);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        rol: body.rol
    });

    usuario.save( ( err, usuario ) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario
        })
    });
});

// Editar usuario Loggeado
app.put( '/api/v1/usuario', [ verificaToken ], ( req, res ) => {
    
    let id = req.usuario._id;
    let body = req.body;

    if ( !id ) {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Ha ocurrido un problema en el programa, por favor contacte al programador. [ User::UNP::PUT::If!ID ]"
            }
        });
    }

    console.log(bcrypt.compareSync(body.password_old, req.usuario.password));

    if ( !bcrypt.compareSync(body.password_old, req.usuario.password) ) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'La contraseña es incorrecta'
            }
        });
    }

    //let update = _.pick( body, ['nombre', 'email', ]);                                                                                                                                                                                                             

    Usuario.findByIdAndUpdate( id, { nombre: body.nombre, email: body.email, password: bcrypt.hashSync( body.password, 10 ) }, { new: true, runValidators: true }, ( err, usuario ) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

        res.json({
            ok: true,
            success: 'El usuario ha sido modificado correctamente',
            usuario,
            token
        });
    });
});

// Modificar usuario - Admin
app.put( '/api/v1/usuario/:id', [ verificaToken, verificaAdminRol ], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    if (!id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID es necesario'
            }
        });
    }

    Usuario.findByIdAndUpdate( id, { nombre: body.nombre, email: body.email, password: bcrypt.hashSync( body.password, 10 ), rol: body.rol }, { new: true, runValidators: true }, (err, usuario) => {

        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `El usuario con ID ${ id } no existe`
                }
            });
        }

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        let token = jwt.sign({
            usuario
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

        res.json({
            ok: true,
            success: 'El usuario ha sido modificado correctamente',
            usuario,
            token
        });
    });
});

// Borrar usuario - Admin
app.delete( '/api/v1/usuario/:id', [ verificaToken, verificaAdminRol ], ( req, res ) => {

    let id = req.params.id;

    if ( !id ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El ID es necesario'
            }
        });
    }

    Usuario.findByIdAndRemove( id, ( err, usuario ) => {
        
        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                err : {
                    message: `El usuario de ID ${ id } no existe`
                }
            });
        }
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario,
            success: 'El usuario ha sido eliminado exitosamente'
        });
    });
});

// Borrar Usuario
app.delete( '/api/v1/usuario', [ verificaToken ], (req, res) => {

    let id = req.usuario._id;
    let body = req.body;

    if ( !id ) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Hubo un problema al ejecutar el programa, por favor contacte al programador. [ User::Del::UNP::If!ID ]'
            }
        });
    }

    Usuario.findById( id, ( err, usuario ) => {

        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !bcrypt.compareSync( body.password, usuario.password ) ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'La contraseña no es correcta'
                }
            });
        }

        Usuario.findByIdAndRemove( id, ( err, usuario ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                success: 'El usuario se ha eliminado exitosamente',
                usuario
            });

        });

    });
    
});

module.exports = app;