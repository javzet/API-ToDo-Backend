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
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use(require('./routes/usuarios'));
app.use(require('./routes/login'));
app.use(require('./routes/todo'));

// Cors
const cors = require('cors');
app.use(cors());

// Run server
app.listen( process.env.PORT, (err) => {
    if ( err ) throw new Error(err);

    console.log(`Running server on port ${ process.env.PORT }`);
});