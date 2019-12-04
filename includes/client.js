var server = window.location.origin;
$(document).ready(function() {
  $('#shortener_form_submit').click(function(event) {
    event.preventDefault(); //prevent default action
    var longUrl = $('#shortener_form_long_url').val();
    $.ajax({
      async: true,
      crossDomain: true,
      url: `${server}/shortenUrl`,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      processData: false,
      data: `{"originalUrl": "${longUrl}"\n}`
    })
      .done(function(response) {
        showMessage(
          '#shortener_message',
          'Here is the shortened url',
          response.shortenedUrl,
          'positive'
        );
      })
      .fail(function(jqXHR, textStatus) {
        showMessage(
          '#shortener_message',
          'Sorry! Some error occured',
          jqXHR.responseText || 'Please try again',
          'negative'
        );
      });
  });

  $('#resolver_form_submit').click(function(event) {
    event.preventDefault(); //prevent default action
    var shortUrl = $('#resolver_form_short_url').val();
    $.ajax({
      async: true,
      crossDomain: true,
      url: `${server}/resolveUrl?shortUrl=${shortUrl}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .done(function(response) {
        showMessage(
          '#resolver_message',
          'Here is the original url',
          response.originalUrl,
          'positive'
        );
      })
      .fail(function(jqXHR, textStatus) {
        showMessage(
          '#resolver_message',
          'Sorry! Some error occured',
          jqXHR.responseText || 'Please try again',
          'negative'
        );
      });
  });
});

var showMessage = (parentDiv, title, message, type) => {
  console.log('show message', $(parentDiv));
  $(parentDiv).empty();
  $(parentDiv).append(`
  <div class="ui ${type} message tiny" style="width: 85%;">
  <div class="header">
    ${title}
  </div>
  <p>${message}
</p></div>
  `);
};
