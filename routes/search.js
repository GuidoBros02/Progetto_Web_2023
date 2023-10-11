'use strict';

const express = require('express');
const router = express.Router();
const filmDao = require('../models/film-dao');

router.get('/search', function (req, res, next) {
    const searchTerm = req.query.title;
  
    if (searchTerm) {
      filmDao.searchFilmByTitle(searchTerm)
        .then((films) => {
          res.render('search-results', { title: 'Risultati della Ricerca', films });
        })
        .catch((err) => {
          console.log(err);
          res.render('search-results', { title: 'Risultati della Ricerca', films: [] });
        });
    } else {
      filmDao.getAllFilms()
        .then((films) => {
          res.render('search-results', { title: 'Risultati della Ricerca', films });
        })
        .catch((err) => {
          console.log(err);
          res.render('search-results', { title: 'Risultati della Ricerca', films: [] });
        });
    }
  });
  