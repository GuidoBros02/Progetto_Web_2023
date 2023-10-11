'use strict';

var express = require('express');
var router = express.Router();
const UtenteDao = require('../models/utente-dao');
const { check, validationResult } = require('express-validator');


router.get('/', function(req, res, next) 
{
  const isLogged = req.isAuthenticated();
  res.render('registrati', { title: 'Registrazione', isLogged, success: null, message: null, date: null });
});

router.post('/', [
  check('nome').notEmpty().withMessage('Nome richiesto'),
  check('cognome').notEmpty().withMessage('Cognome richiesto'),
  check('email').notEmpty().withMessage('Email richiesto'),
  check('password1').isLength({ min: 8 }).withMessage('La Password deve essere di almeno 8 caratteri'),
  check('password1').matches(/\d/).withMessage('Password must contain at least one numeral'),
  check('citta').notEmpty().withMessage('Citta richiesta'),
  check('indirizzo').notEmpty().withMessage('Indirizzo richiesto'),
  check('data').notEmpty().withMessage('Data di Nascita richiesta')
], async function(req, res, next) {
  const errors = validationResult(req);
  const isLogged = req.isAuthenticated;

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.render('registrati', { title: 'Registrazione', isLogged, message: errorMessages[0], success: null });
  } 
  else 
  {
    try 
    {
      await UtenteDao.registerUser(req.body.nome, req.body.cognome, req.body.email, req.body.password1, req.body.citta, req.body.indirizzo, req.body.data);
      res.redirect('/homepage');
    } 
    catch (error) 
    {
      res.render('registrati', { title: 'Registrazione', isLogged: false, success: null, message: 'Email già utilizzata' });
    }
  }
});

module.exports = router;
