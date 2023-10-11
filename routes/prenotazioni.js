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
    // Ottieni la lista dei film preferiti dell'utente dal database
    // Utilizza il tuo DAO o modulo di accesso al database per ottenere i dati
    UtenteDao.getPrenotazioni(user.email)
      .then((prenotazioni) => {
        console.log(prenotazioni);
        res.render('prenotazioni', { title: 'Prenotazioni', prenotazioni, isLogged: true });
      })
      .catch((err) => {
        res.render('prenotazioni', { title: 'Prenotazioni', prenotazioni: [], isLogged: true, error: err });
      });
  } 
  else 
  {
    // L'utente non è autenticato, reindirizza alla pagina di accesso
    res.redirect('/accedi');
  }
});



module.exports = router;
