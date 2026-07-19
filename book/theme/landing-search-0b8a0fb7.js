(function () {
  var bigSearch = document.getElementById('big-search');
  var landingForm = document.getElementById('landing-search-form');
  if (!bigSearch || !landingForm) return;

  document.body.classList.add('page-landing');

  function submitSearch(event) {
    if (event) event.preventDefault();

    var query = bigSearch.value.trim();
    if (!query) return;

    // Search on a regular chapter page so mdBook owns the results UI, focus,
    // keyboard navigation, history, and toolbar state from this point onward.
    var target = new URL('using-this-book.html', window.location.href);
    target.searchParams.set('search', query);
    window.location.assign(target.href);
  }

  landingForm.addEventListener('submit', submitSearch);

  var tags = document.querySelectorAll('.landing-tag');
  for (var i = 0; i < tags.length; i++) {
    tags[i].addEventListener('click', function () {
      bigSearch.value = this.getAttribute('data-search');
      submitSearch();
    });
  }
})();
