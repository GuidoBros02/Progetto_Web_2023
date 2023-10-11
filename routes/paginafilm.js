const express = require('express');
const router = express.Router();
const filmDao = require('../models/film-dao');

router.get('/:id', function (req, res, next) {
  const filmId = req.params.id;
  console.log(filmId); // Verifica il valore di filmId

  filmDao.getFilmById(filmId)
    .then(film => {
      res.render('paginafilm', { film }); // Passa il singolo film come un array
    })
    .catch(error => {
      console.log(error);
      res.render('error');
    });
});

module.exports = router;
