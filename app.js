const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//DB config
const db = require('./config/keys').MongoURI;

// Passport config
require('./config/passport')(passport);

//Connect to MongoDB
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Mongo DB connected...'))
    .catch(error => console.log(error));

// Style middleware
app.use(express.static(path.join(__dirname, 'node_modules')));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started  on port ${PORT}`));