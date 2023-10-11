'use strict';

var filter = document.getElementById('applicaFiltri');

filter.addEventListener('click', function () {
  const genereFilter = document.getElementById('genere');
  var selectedGenere = genereFilter.options[genereFilter.selectedIndex].text;
  const annoFilter = document.getElementById('anno')
  var selectedAnno = annoFilter.options[annoFilter.selectedIndex].text;

  var bodycards = document.querySelectorAll('.bodycard');

  bodycards.forEach(function (bodycard) {
    const filmGenere = bodycard.getAttribute('genere');
    const filmAnno = bodycard.getAttribute('anno');

    if ((selectedGenere !== '' && filmGenere !== selectedGenere) ||
      (selectedAnno !== '' && filmAnno !== selectedAnno)) {
      bodycard.style.display = 'none';
    }
    else {
      bodycard.style.display = 'block';
    }
  });
});