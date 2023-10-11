'use strict';
var express = require('express');
const UtenteDao = require('../models/utente-dao');
var router = express.Router();

// Importa il DAO o modulo per l'accesso al database per gestire i preferiti

// GET /preferiti
router.get('/', function(req, res, next) {
  // Verifica se l'utente è autenticato
  if (req.isAuthenticated()) {
    const user = req.user; // Utilizza req.user invece di req.sessions.user
    console.log(user);
    // Ottieni la lista dei film preferiti dell'utente dal database
    // Utilizza il tuo DAO o modulo di accesso al database per ottenere i dati
    UtenteDao.getCarrelloUtente(user.email)
      .then((carrello) => {
        console.log(carrello);
        res.render('carrello', { title: 'Carrello', carrello, isLogged: true });
      })
      .catch((err) => {
        res.render('carrello', { title: 'Carrello', carrello: [], isLogged: true, error: err });
      });
  } else {
    // L'utente non è autenticato, reindirizza alla pagina di accesso
    res.redirect('/accedi');
  }
});

module.exports = router;
