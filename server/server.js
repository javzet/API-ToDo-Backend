// Declaración Express
const express = require('express');
const app = express();

// Cors
const cors = require('cors');
const whiteList = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://javzet.github.io"
];

const CORS_OPTIONS = {
    origin: whiteList,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(CORS_OPTIONS));

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

// Run server
app.listen( process.env.PORT, (err) => {
    if ( err ) throw new Error(err);

    console.log(`Running server on port ${ process.env.PORT }`);
});