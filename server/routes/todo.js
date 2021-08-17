// Expresss
const express = require('express');
const app = express();

// Importar modelos
const Todo = require('../models/todo');
const Usuario = require('../models/usuario');

// Middlewares
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Obtener mis tareas
app.get( '/api/v1/todo', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;

    Todo.find( { usuario: userid } )
        .exec( (err, todo) => {
            
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
                
                return res.json({
                    ok: true,
                    usuario,
                    todo
                });
            });
        }); 
});

// Agregar una tarea
app.post( '/api/v1/todo', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;
    let body = req.body;

    let todo = new Todo({
        todo: body.todo,
        usuario: userid
    });

    Usuario.findById( userid, ( err, usuario ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        todo.save(( err, todo ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                success: 'Se ha creado una nueva tarea',
                todo,
                usuario
            });
        });
    });
});

// Completar tarea
app.put( '/api/v1/todo/:id', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;
    let id = req.params.id;
    let body = req.body;

    let update = {
        completed: body.completed
    }

    Todo.findOneAndUpdate( { _id: id, usuario: userid }, update, { new: true, runValidators: true } )
        .exec( ( err, todo ) => {

            if ( !todo ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La tarea que intentas completar no existe'
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
                    usuario,
                    todo
                });
            });
        });

    // CSRF

    /*Usuario.findById( userid, ( err, usuario ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Todo.findByIdAndUpdate( id, update, { new: true, runValidators: true }, ( err, todo ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                todo,
                usuario
            });
            
        });
    });*/
});

// Filtrar tareas completadas/no completadas
app.post( '/api/v1/todo-completed', [ verificaToken ], ( req, res ) => {

    let userid = req.usuario._id;
    let body = req.body;
    
    Todo.find( { completed: body.completed, usuario: userid } )
        .exec( ( err, todo ) => {

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
                    usuario,
                    todo
                });
            });
        });
});

// Borrar una tarea
app.delete( '/api/v1/todo/:id', [ verificaToken ], ( req, res ) => {
    
    let id = req.params.id;
    let userid = req.usuario._id;
    
    Todo.findOneAndRemove( { _id: id, usuario: userid  } )
        .exec( (err, todo) => {

            if ( !todo ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La tarea que intentas eliminar no existe'
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
                    success: 'La tarea se ha eliminado exitosamente',
                    usuario,
                    todo
                });
            });

        });

});

module.exports = app;