'use strict';

var express = require('express');
var router = express.Router();
const UtenteDao = require('../models/utente-dao');
const filmDao = require('../models/film-dao');
const { check, validationResult } = require('express-validator');


router.get('/', function (req, res, next) {
    const isLogged = req.isAuthenticated();
    const user = req.user;
    res.render('pannello', { title: 'Pannello', message: null, isLogged, user });
});

router.post('/insert-film', [
    check('Titolo').notEmpty().withMessage('Titolo richiesto'),
    check('Copertina').notEmpty().withMessage('Copertina richiesto'),
    check('Anno').notEmpty().withMessage('Anno richiesto'),
    check('Durata').notEmpty().withMessage('Durata richiesta'),
    check('Regista').notEmpty().withMessage('Regista richiesta'),
    check('Genere').notEmpty().withMessage('Genere richiesta'),
    check('Distribuzione').notEmpty().withMessage('Distribuzione richiesto'),
    check('Attori').notEmpty().withMessage('Attori richiesta'),
    check('Prezzo').notEmpty().withMessage('Prezzo richiesta')
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        /*const isLogged = req.isAuthenticated;
        const user = req.user;
        res.render('pannello', { title: 'pannello', message: messages[0], isLogged, user });*/
    }
    else {
        try {
            const film = {
                Titolo: req.body.Titolo,
                Copertina: req.body.Copertina,
                Anno: parseInt(req.body.Anno),
                Durata: parseInt(req.body.Durata),
                Regista: req.body.Regista,
                Genere: req.body.Genere,
                Distribuzione: req.body.Distribuzione,
                Attori: req.body.Attori,
                Prezzo: parseInt(req.body.Prezzo)
            }
            filmDao.addFilm(film).then((id) => { res.redirect('/pannello'); });
            
        }
        catch (error) {
            const isLogged = req.isAuthenticated();
            const user = req.user;
            res.render('pannello', { title: 'Pannello', isLogged, message: 'Errore nel salvataggio', user });
        }
    }
});

module.exports = router;
