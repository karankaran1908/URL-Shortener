var server = window.location.origin;
$(document).ready(function() {
  $('#shortener_form_submit').click(function(event) {
    event.preventDefault(); //prevent default action
    var longUrl = $('#shortener_form_long_url').val();
    console.log(longUrl);
    var post_url = `${server}/shortenUrl`;
    var request_method = 'POST'; //get form GET/POST method
    console.log({
      originalUrl: longUrl
    });

    $.ajax({
      url: post_url,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: {
        originalUrl: longUrl
      }
    })
      .done(function(response) {
        console.log(response);
        showMessage(
          '#shortener_message',
          'Here is the shortened url',
          jqXHR.responseText || 'Please try again',
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
});

var showMessage = (parentDiv, title, message, type) => {
  console.log('show message', $(parentDiv));
  $(parentDiv).empty();
  $(parentDiv).append(`
  <div class="ui ${type} message tiny">
  <div class="header">
    ${title}
  </div>
  <p>${message}
</p></div>
  `);
};
