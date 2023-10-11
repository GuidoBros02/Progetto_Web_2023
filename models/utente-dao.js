'use strict';
const db = require('../db.js');
const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const filmDao = require('./film-dao');

exports.getUserByEmail = function (email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utenti WHERE Email = ?';
    db.get(sql, [email], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        resolve(row);
      }
    });
  });
};

exports.getUser = function (email, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utenti WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        const user = { username: email, type: 'user' };
        let check = false;

        if (user.admin === 0) 
        {
          if (bcrypt.compareSync(password, row.Psw))
            check = true;
        }
        else
          check = true;

        resolve({ user, check });
      }
    });
  });
};

exports.registerUser = function (nome, cognome, email, password, citta, indirizzo, data) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO utenti (nome, cognome, email, password, citta, indirizzo, data) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const hashedPassword = bcrypt.hashSync(password, 10);
    const values = [nome, cognome, email, hashedPassword, citta, indirizzo, data];
    db.run(sql, values, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

exports.aggiungiPreferito = function (email, IDFilm) {
  return new Promise((resolve, reject) => {
    const sqlCheck = 'SELECT COUNT(*) AS count FROM preferiti WHERE email = ? AND IDFilm = ?';
    db.get(sqlCheck, [email, IDFilm], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        reject('La riga già esiste');
        return;
      }

      const sqlInsert = 'INSERT INTO preferiti (email, IDFilm) VALUES (?, ?)';
      db.run(sqlInsert, [email, IDFilm], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

exports.rimuoviPreferito = function (email, IDFilm) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM preferiti WHERE Email = ? AND IDFilm = ?';
    db.run(sql, [email, IDFilm], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.getPreferitiUtente = function (email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT film.IDFilm as IDFilm, film.Titolo as Titolo, film.Copertina as Copertina, film.Anno as Anno, film.Regista as Regista, film.Genere as Genere, film.Attori as Attori, film.Prezzo as Prezzo, preferiti.email as email FROM preferiti JOIN film ON preferiti.IDFilm=film.IDFilm WHERE email = ?';
    db.all(sql, [email], (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve({ error: 'Non sono presenti preferiti.' });
      else {
        const preferiti = rows.map((e) => ({
          IDFilm: e.IDFilm,
          Titolo: e.Titolo,
          Copertina: e.Copertina,
          Anno: e.Anno,
          Durata: e.Durata,
          Regista: e.Regista,
          Genere: e.Genere,
          Distribuzione: e.Distribuzione,
          Attori: e.Attori,
          Disponibilità: e.Disponibilità,
          Prezzo: e.Prezzo,
          Email: e.email
        }));
        resolve(preferiti);
      }
    });
  });
};

exports.aggiungiCarrello = function (email, IDFilm) {
  return new Promise((resolve, reject) => {
    const sqlCheck = 'SELECT COUNT(*) AS count FROM carrello WHERE email = ? AND IDFilm = ?';
    db.get(sqlCheck, [email, IDFilm], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        reject('La riga già esiste');
        return;
      }

      const sqlInsert = 'INSERT INTO carrello (email, IDFilm) VALUES (?, ?)';
      db.run(sqlInsert, [email, IDFilm], (err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    });
  });
};

exports.rimuoviCarrello = function (email, IDFilm) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM carrello WHERE email = ? AND IDFilm = ?';
    db.run(sql, [email, IDFilm], (err) => {
      if (err)
        reject(err);
      else
        resolve();
    });
  })
    .catch((err) => {
      reject(err);
    });
};

exports.getCarrelloUtente = function (email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT film.IDFilm as IDFilm, film.Titolo as Titolo, film.Copertina as Copertina, film.Anno as Anno, film.Regista as Regista, film.Genere as Genere, film.Attori as Attori, film.Prezzo as Prezzo FROM carrello JOIN film ON carrello.IDFilm=film.IDFilm WHERE email = ?';
    db.all(sql, [email], (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve({ error: 'Non sono presenti prodotti nel carrello.' });
      else {
        const carrello = rows.map((e) => ({
          IDFilm: e.IDFilm,
          Titolo: e.Titolo,
          Copertina: e.Copertina,
          Anno: e.Anno,
          Regista: e.Regista,
          Genere: e.Genere,
          Attori: e.Attori,
          Prezzo: e.Prezzo,
        }));
        resolve(carrello);
      }
    });
  });
};

exports.aggiungiPrenotazioni = function (email, IDFilm) {
  return new Promise((resolve, reject) => {
    const sqlCheck = 'SELECT COUNT(*) AS count FROM prenotazioni WHERE email = ? AND IDFilm = ?';
    db.get(sqlCheck, [email, IDFilm], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        reject('La riga già esiste');
        return;
      }

      const sqlInsert = 'INSERT INTO prenotazioni (email, IDFilm) VALUES (?, ?)';
      db.run(sqlInsert, [email, IDFilm], (err) => {
        if (err) {
          reject(err);
        } else {
          exports.rimuoviCarrello(email, IDFilm)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }
      });
    });
  });
};

exports.rimuoviPrenotazioni = function (email, IDFilm) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM prenotazioni WHERE email = ? AND IDFilm = ?';
    db.run(sql, [email, IDFilm], (err) => {
      if (err)
        reject(err);
      else
        resolve();
    });
  })
    .catch((err) => {
      reject(err);
    });
};

exports.getPrenotazioni = function (email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT film.IDFilm as IDFilm, film.Titolo as Titolo, film.Copertina as Copertina, film.Anno as Anno, film.Regista as Regista, film.Genere as Genere, film.Attori as Attori, film.Prezzo as Prezzo FROM prenotazioni JOIN film ON prenotazioni.IDFilm=film.IDFilm WHERE email = ?';
    db.all(sql, [email], (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve({ error: 'Non sono presenti prodotti prenotati.' });
      else {
        const prenotazioni = rows.map((e) => ({
          IDFilm: e.IDFilm,
          Titolo: e.Titolo,
          Copertina: e.Copertina,
          Anno: e.Anno,
          Regista: e.Regista,
          Genere: e.Genere,
          Attori: e.Attori,
          Prezzo: e.Prezzo,
        }));
        resolve(prenotazioni);
      }
    });
  });
};

exports.saveUtente = function (utente) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE utenti SET preferiti = ? WHERE Email = ?';
    const values = [utente.preferiti, utente.Email];
    db.run(sql, values, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


