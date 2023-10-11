'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Pagina di accesso
router.get('/accedi', function (req, res, next) {
    const isLogged = req.isAuthenticated();
    res.render('accedi', { title: 'Accedi', isLogged, success: null, messaggio: null });
});

/* Effettua l'accesso */
router.post('/', function (req, res, next) {
    passport.authenticate('user', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            const isLogged = req.isAuthenticated();
            return res.render('accedi', { title: 'Accedi', isLogged, success: null, messaggio: info.message });
        }
        // Successo, effettua l'accesso
        req.login(user, function (err) {
            if (err) { return next(err); }
            // req.user contiene l'utente autenticato
            res.redirect('/homepage');
            console.log(user);
        });
    })(req, res, next);
});

// Middleware per gestire gli errori
router.use(function (err, req, res, next) {
    // Mostra il messaggio di errore a schermo
    res.render('accedi', { title: 'Accedi', isLogged: req.isAuthenticated(), success: null, messaggio: err.message });
});

router.post('/logout', function(req, res, next)
{
    req.logout(function(err)
    {
        if(err)
        {
            return next(err);
        }
        res.redirect('/homepage');
    });
});

module.exports = router;
