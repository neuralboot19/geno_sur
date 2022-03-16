// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
//= require jquery3
//= require jquery_ujs
import "@hotwired/turbo-rails"
import "controllers"

$('.button_press').click(function() {
  $.ajax({
    url: 'https://randomfox.ca/floof/',
    method: 'get',
    dataType: 'json',
  }).done(
    function(response){
      console.log("Response =>>> ", response);
      $('.button_press').text('Quiero más');
      $('.floof_img').attr('src', response.image);
    }
  ).fail(
    function(response){
      console.log("Error =>>>", response);
    }
  );
});
