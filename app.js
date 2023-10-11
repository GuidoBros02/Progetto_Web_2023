'use strict';
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const UtenteDao = require('./models/utente-dao.js');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const homepageRouter = require('./routes/homepage');
const paginafilmRouter = require('./routes/paginafilm');
const accessoRouter = require('./routes/sessions');
const registratiRouter = require('./routes/registrati');
const preferitiRouter = require('./routes/preferiti');
const carrelloRouter = require('./routes/carrello');
const prenotazioniRouter = require('./routes/prenotazioni');
const pannelloRouter = require('./routes/pannello');
const { Passport } = require('passport');


var app = express();

// Imposta EJS come motore di rendering dei template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use('user', new LocalStrategy(
    function (email, password, done) {
        UtenteDao.getUser(email, password).then(({user, check}) => {
            if (!user) 
            {
                return done(null, false, { message: 'Email non corrette.' });
            }
            if(!check)
            {
                return done(null, false, { message: 'Password non corretta.' });
            }
            return done(null, user);
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (email, done) {
    UtenteDao.getUserByEmail(email).then(user => { done(null, user); });
});

app.use(session({
    secret: 'il-tuo-segreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const isLogged = (req, res, next) => {
    if (req.isAuthenticated() && !req.user.error) {
        next();
    }
    else {
        res.redirect('/accedi');
    }
};

app.use('/homepage', homepageRouter);
app.use('/', homepageRouter);
app.use('/paginafilm', paginafilmRouter);
app.use('/', accessoRouter);
app.use('/sessions', accessoRouter);
app.use('/registrati', registratiRouter);
app.use('/preferiti', isLogged, preferitiRouter);
app.use('/carrello', isLogged, carrelloRouter);
app.use('/prenotazioni', prenotazioniRouter);
app.use('/pannello', isLogged, pannelloRouter);

// Gestione degli errori
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
