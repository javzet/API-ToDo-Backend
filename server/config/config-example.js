// PORT
process.env.PORT = process.env.PORT || 8080;

// Database
process.env.URLDB = 'mongodb+srv://<username>:<password>@<cluster>.w1vjr.mongodb.net/<DB>?retryWrites=true&w=majority'

// JWT
process.env.SEED = process.env.SEED || 'supermegasecret';
process.env.CADUCIDAD = '7d';