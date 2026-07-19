(function () {
  var bigSearch = document.getElementById('big-search');
  if (!bigSearch) return;

  document.body.classList.add('page-landing');

  var realSearch = document.getElementById('mdbook-searchbar');
  var searchToggle = document.getElementById('mdbook-search-toggle');
  var searchWrap = document.getElementById('mdbook-search-wrapper');

  function forwardSearch() {
    if (!realSearch) return;
    realSearch.value = bigSearch.value;

    if (searchWrap && searchWrap.classList.contains('hidden')) {
      searchToggle.click();
      setTimeout(function () {
        realSearch.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        realSearch.focus();
      }, 200);
    } else {
      realSearch.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    }
  }

  bigSearch.addEventListener('input', forwardSearch);
  bigSearch.addEventListener('focus', function () {
    if (this.value) forwardSearch();
  });

  var tags = document.querySelectorAll('.landing-tag');
  for (var i = 0; i < tags.length; i++) {
    tags[i].addEventListener('click', function () {
      bigSearch.value = this.getAttribute('data-search');
      forwardSearch();
    });
  }
})();
