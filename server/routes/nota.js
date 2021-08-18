// Express
const express = require('express');
const app = express();

// Models
const Usuario = require('../models/usuario');
const Nota = require('../models/nota');

// Middlewares
const { verificaToken } = require('../middlewares/autenticacion');

//Obtener todas mis notas
app.get( '/api/v1/nota', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;

    Nota.find( { usuario: userid } )
        .exec( ( err, notas ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.findById( userid, (err, usuario) => {

                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if ( notas.length === 0 ) {
                    return res.json({
                        ok: true,
                        usuario,
                        message: 'No tienes ningúna nota aún.'
                    });
                }

                res.json({
                    ok: true,
                    usuario,
                    notas
                })

            });

        });

});

// Crear nueva nota
app.post( '/api/v1/nota', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;
    let body = req.body;

    let newNota = new Nota({
        titulo: body.titulo,
        descripcion: body.descripcion,
        img: null,
        usuario: userid
    });

    Usuario.findById( userid, ( err, usuario ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        newNota.save( ( err, nota ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario,
                nota
            });
        });
    });

});

// Editar nota
app.put( '/api/v1/nota/:id', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;
    let id = req.params.id;
    let body = req.body;

    let update = {
        titulo: body.titulo,
        descripcion: body.descripcion
    }

    Nota.findOneAndUpdate( { _id: id, usuario: userid }, update, { new: true, runValidators: true } )
        .exec( ( err, nota ) => {

            if ( !nota ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La nota que intentas borrar no existe'
                    }
                });
            }

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.findById( userid, ( err, usuario ) => {
                
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    success: 'La nota ha sido editada exitosamente',
                    usuario,
                    nota
                });
            });
        });
});

// Borrar nota
app.delete( '/api/v1/nota/:id', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;
    let id = req.params.id;

    Nota.findOneAndDelete( { _id: id, usuario: userid } )
        .exec( ( err, nota ) => {

            if ( !nota ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La nota que intentas eliminar no existe'
                    }
                });
            }

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.findById( userid, ( err, usuario ) => {

                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    success: 'La nota se ha eliminado exitosamente',
                    usuario,
                    nota
                })

            });

        });

});

module.exports = app;