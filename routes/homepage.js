const express = require('express');
const router = express.Router();
const filmDao = require('../models/film-dao');
const UtenteDao = require('../models/utente-dao');
const { check, validationResult } = require('express-validator');

router.get('/', function (req, res, next) {
  filmDao.getAllFilms()
    .then((films) => {
      filmDao.getAllGenere()
        .then((generi) => {
          filmDao.getAllAnno()
            .then((anni) => {
              const isLogged = req.isAuthenticated();
              const user = req.user;
              res.render('homepage', { films, generi, anni, isLogged, user });
            })
            .catch((error) => {
              console.log(error);
              next(error);
            });
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get('/homepage', function (req, res, next) {
  filmDao.getAllFilms().then((films) => {
    filmDao.getAllGenere().then((generi) => {
      filmDao.getAllAnno().then((anni) => {
        const isLogged = req.isAuthenticated();
        const user = req.user;
        res.render('homepage', { films, generi, anni, isLogged, user });
      })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.post('/search', [
  check('search').notEmpty()
], async function (req, res, next) {
      const search = '%' + req.body.search + '%';
      filmDao.getSearchFilms(search).then((films) => {
        filmDao.getAllGenere().then((generi) => {
          filmDao.getAllAnno().then((anni) => {
            console.log(films);
            const user = req.user;
            const isLogged = req.isAuthenticated();
            res.render('homepage', { films, isLogged, user, generi, anni });
          });
        });
      });
    }
);

router.post('/preferiti/aggiungi/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;

  // Verifica se l'utente è autenticato
  const isLoggedIn = req.isAuthenticated();
  if (!isLoggedIn) {
    res.redirect('/accedi');
  }

  try {
    // Ottieni l'utente autenticato
    const user = req.user;

    // Aggiungi il film ai preferiti dell'utente nel database
    await UtenteDao.aggiungiPreferito(user.email, IDFilm);
    UtenteDao.getPreferitiUtente(user.email)
      .then((preferiti) => {
        res.render('preferiti', { title: 'Preferiti', preferiti, isLogged: true });
      })
      .catch((err) => {
        res.render('preferiti', { title: 'Preferiti', preferiti: [], isLogged: true, error: err });
      });
  }
  catch (error) {
    filmDao.getAllFilms().then((films) => {
      filmDao.getAllGenere().then((generi) => {
        filmDao.getAllAnno().then((anni) => {
          console.log(films);
          const user = req.user;
          const isLogged = req.isAuthenticated();
          res.render('homepage', { films, isLogged, user, generi, anni });
        });
      });
    }).catch((error) => {
      console.log(error);
      next(error);
    });
  }
});

router.post('/preferiti/cancella/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;
  const user = req.user;

  await UtenteDao.rimuoviPreferito(user.email, IDFilm);
  UtenteDao.getPreferitiUtente(user.email)
    .then((preferiti) => {
      res.render('preferiti', { title: 'Preferiti', preferiti, isLogged: true });
    })
    .catch((err) => {
      res.render('preferiti', { title: 'Preferiti', preferiti: [], isLogged: true, error: err });
    });
});

router.post('/carrello/aggiungi/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;

  // Verifica se l'utente è autenticato
  const isLoggedIn = req.isAuthenticated();
  if (!isLoggedIn) {
    res.redirect('/accedi');
  }

  try {
    // Ottieni l'utente autenticato
    const user = req.user;

    // Aggiungi il film ai preferiti dell'utente nel database
    await UtenteDao.aggiungiCarrello(user.email, IDFilm);
    UtenteDao.getCarrelloUtente(user.email)
      .then((carrello) => {
        res.render('carrello', { title: 'Carrello', carrello, isLogged: true });
      })
      .catch((err) => {
        res.render('carrello', { title: 'Carrello', carrello: [], isLogged: true, error: err });
      });
  }
  catch (error) {
    filmDao.getAllFilms().then((films) => {
      filmDao.getAllGenere().then((generi) => {
        filmDao.getAllAnno().then((anni) => {
          console.log(films);
          const user = req.user;
          const isLogged = req.isAuthenticated();
          res.render('homepage', { films, isLogged, user, generi, anni });
        });
      });
    });
  }
});

router.post('/carrello/cancella/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;
  const user = req.user;

  await UtenteDao.rimuoviCarrello(user.email, IDFilm);
  UtenteDao.getCarrelloUtente(user.email)
    .then((carrello) => {
      res.render('carrello', { title: 'Carrello', carrello, isLogged: true });
    })
    .catch((err) => {
      res.render('carrello', { title: 'Carrello', carrello: [], isLogged: true, error: err });
    });
});

router.post('/prenotazioni/aggiungi/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;

  // Verifica se l'utente è autenticato
  const isLoggedIn = req.isAuthenticated();
  if (!isLoggedIn) {
    res.redirect('/accedi');
  }

  try {
    // Ottieni l'utente autenticato
    const user = req.user;

    // Aggiungi il film ai preferiti dell'utente nel database
    await UtenteDao.aggiungiPrenotazioni(user.email, IDFilm);
    UtenteDao.getPrenotazioni(user.email)
      .then((prenotazioni) => {
        res.render('prenotazioni', { title: 'Prenotazioni', prenotazioni, isLogged: true });
      })
      .catch((err) => {
        res.render('prenotazioni', { title: 'Prenotazioni', prenotazioni: [], isLogged: true, error: err });
      });
  }
  catch (error) {
    filmDao.getAllFilms().then((films) => {
      filmDao.getAllGenere().then((generi) => {
        filmDao.getAllAnno().then((anni) => {
          console.log(films);
          const user = req.user;
          const isLogged = req.isAuthenticated();
          res.render('homepage', { films, isLogged, user, generi, anni });
        });
      });
    });
  }
});

router.post('/prenotazioni/cancella/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;
  const user = req.user;

  await UtenteDao.rimuoviPrenotazioni(user.email, IDFilm);
  UtenteDao.getPrenotazioni(user.email)
    .then((prenotazioni) => {
      res.render('prenotazioni', { title: 'Prenotazioni', prenotazioni, isLogged: true });
    })
    .catch((err) => {
      res.render('prenotazioni', { title: 'Prenotazioni', prenotazioni: [], isLogged: true, error: err });
    });
});

router.post('/homepage/cancella/:IDFilm', async function (req, res, next) {
  const IDFilm = req.params.IDFilm;
  try {
    await filmDao.removeFilm(IDFilm);
    res.redirect('/homepage');
  } catch (err) {
    console.error(err);
    res.redirect('/homepage');
  }
});

module.exports = router;
