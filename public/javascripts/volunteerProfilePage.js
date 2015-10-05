$(document).ready(function() {
  $('.reco').on("click", function(e){
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $(".recommendation").offset().top
    }, "slow");
  });
});