'use strict';
const db = require('../db.js');
const sqlite = require('sqlite3');

exports.getAllFilms = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM film';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const films = rows.map((e) => ({
        IDFilm: e.IDFilm,
        Titolo: e.Titolo,
        Copertina: e.Copertina,
        Anno: e.Anno,
        Durata: e.Durata,
        Regista: e.Regista,
        Genere: e.Genere,
        Distribuzione: e.Distribuzione,
        Attori: e.Attori,
        Prezzo: e.Prezzo,
      }));
      resolve(films);
    });
  });
};

exports.addFilm = function (film) {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO film ( Titolo, Copertina, Anno, Durata, Regista, Genere, Distribuzione, Attori, Prezzo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      film.Titolo,
      film.Copertina,
      film.Anno,
      film.Durata,
      film.Regista,
      film.Genere,
      film.Distribuzione,
      film.Attori,
      film.Prezzo,
    ];
    db.run(sql, values, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.removeFilm = function (IDFilm){
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM film WHERE IDFilm = ? ';
    db.run(sql, [IDFilm], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.getFilmById = function (IDFilm) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM film WHERE IDFilm = ?';
    db.get(sql, [IDFilm], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (!row) {
        reject('Film non trovato');
        return;
      }
      const film = {
        IDFilm: row.IDFilm,
        Titolo: row.Titolo,
        Copertina: row.Copertina,
        Anno: row.Anno,
        Durata: row.Durata,
        Regista: row.Regista,
        Genere: row.Genere,
        Distribuzione: row.Distribuzione,
        Attori: row.Attori,
        Prezzo: row.Prezzo,
      };
      resolve(film);
    });
  });
};

exports.getAllPreferiti = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM preferiti';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const preferiti = rows.map((e) => ({ Titolo: e.Titolo, IDFilm: e.IDFilm }));
    });
  });
};

exports.getSearchFilms = function (search) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM film where Titolo like ? or Regista like ? or Attori like ? or Distribuzione like ?';
    const params = Array(4).fill(search);
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((e) => ({
        IDFilm: e.IDFilm,
        Titolo: e.Titolo,
        Copertina: e.Copertina,
        Anno: e.Anno,
        Durata: e.Durata,
        Regista: e.Regista,
        Genere: e.Genere,
        Distribuzione: e.Distribuzione,
        Attori: e.Attori,
        Prezzo: e.Prezzo
      }));
      resolve(films);
    });
  });
};

exports.getAllGenere = function ()
{
  return new Promise((resolve, reject) => {
    const sql = 'Select Distinct genere from film';
    db.all(sql, (err, rows)=> {
      if(err)
      {
        reject(err);
        return;
      }
      const genere = rows.map((e) => ({ genere: e.Genere}));
      resolve(genere);
    });
  });
};

exports.getAllAnno = function ()
{
  return new Promise((resolve, reject) => {
    const sql = 'Select Distinct anno from film';
    db.all(sql, (err, rows)=> {
      if(err)
      {
        reject(err);
        return;
      }
      const anno = rows.map((e) => ({ anno: e.Anno}));
      resolve(anno);
    });
  });
};

