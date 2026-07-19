(function () {
  var sequenceNav = document.querySelector('.incantation-nav, .ritual-nav');
  if (sequenceNav) {
    document.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          /^(?:input|select|textarea)$/i.test(event.target.nodeName)) return;

      var direction = event.key === 'ArrowLeft' ? 'prev' :
        event.key === 'ArrowRight' ? 'next' : null;
      if (!direction) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      var destination = sequenceNav.querySelector('a[rel="' + direction + '"]');
      if (destination) window.location.assign(destination.href);
    }, true);
  }

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
