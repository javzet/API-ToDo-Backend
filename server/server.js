// Declaración Express
const express = require('express');
const app = express();

// Configuración
require('./config/config');

// Public Path
const path = require('path');
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// Database configuration
const mongoose = require('mongoose');
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ( err ) => {
    if (err) throw new Error(err);
    console.log('Database Working');
});

// Body-parser
//const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(require('./routes/usuarios'));
app.use(require('./routes/login'));
app.use(require('./routes/todo'));
app.use(require('./routes/nota'));

// Cors
const cors = require('cors');
let whiteList = ['http://localhost:3000']
app.use(cors( { origin: true, credentials: true } ));

// Configurar cabeceras y cors
/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/


// Run server
app.listen( process.env.PORT, (err) => {
    if ( err ) throw new Error(err);

    console.log(`Running server on port ${ process.env.PORT }`);
});