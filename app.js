const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const oAuth2Server = require('oauth2-server');
const tokensModel = require('./models/tokens');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

//DB config
const db = require('./config').MongoURI;

//Connect to MongoDB
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('Mongo DB connected...'))
    .catch(error => console.log(error));

// Style middleware
//app.use(express.static(path.join(__dirname, 'node_modules')));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.oauth = new oAuth2Server({
    model: tokensModel,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

//console.log(app.oauth.authenticate)
//console.log(app.oauth.authorize)

// Express session
/*app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));*/

// Global variables Access-Control-Allow-Origin
app.use((req, res, next) => {
    /*res.header("Access-Control-Allow-Origin", "*");
    // CORS
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Cache-Control', 'no-cache, must-revalidate');
        res.sendStatus(204); // no content
        res.send();
    } else {*/
        res.locals.success_msg = 'success_msg';
        res.locals.error_msg = 'error_msg';
        res.locals.error = 'error';
        next();
    //}
});

//Routes
routes.forEach((route) => {
    app.use( ...route );
});
//app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started  on port ${PORT}`));