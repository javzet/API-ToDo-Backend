const jwt = require('jsonwebtoken');

// Verificar Token

let verificaToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, ( err, decoded ) => {
        if ( err ) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es válido',
                    err
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

}

// Verificar Admin rol

let verificaAdminRol = ( req, res, next ) => {
    let usuario = req.usuario;

    if ( usuario.rol === 'ADMINMUYINDESCIFRABLEJAJASALU2_ROLE' ) {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'No tienes permiso para acceder a este recurso'
            }
        });
    }
}

module.exports = {
    verificaAdminRol,
    verificaToken
}