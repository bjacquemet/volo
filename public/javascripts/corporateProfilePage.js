$(document).ready(function() {
  var $body = $(document.body),
    $doc = $(document),
    $popup = $(),
    $layover = $(),
    $back = $();
  $(document).ready(function() {

    $('.support_vol li .overlay').on('click', function() {
      $body.css('overflow', 'hidden');
      $popup.remove();
      $layover.remove();
      $back.remove();
      $popup = $('<div class="popup fadeout">').append(
          '<img src="'+$(this).prev().attr('src')+'"/></div>')
        .appendTo(document.body);

      $layover = $('<div class="layover fadeout">').appendTo(document.body);

      //- $back = $('<span class="back glyphicon glyphicon-remove"></span>').appendTo($(".popup"));
      setTimeout(function () {
        $popup.removeClass('fadeout');
        $layover.removeClass('fadeout');
        $back.removeClass('fadeout');
        $doc.on('click', closeImage);
        $doc.keyup(function(e) {
          if (e.keyCode == 27) { closeImage(); }  
        });
      }, 20);
      $(window).resize();
    });
    $(window).resize(function(){
      $('.popup').css({
        width: $('.popup').width()+'px',
        height: $('.popup').height()+'px',
        marginLeft: $('.popup').width() * -0.5 + 'px',
        marginTop: $('.popup').height() * -0.5 + 'px'
      });

      });
  });
  
  closeImage = function () {
    $body.css('overflow', '');
    $doc.off('click', closeImage);
    $popup.removeClass('fadeout');
    $layover.removeClass('fadeout');
    $back.removeClass('fadeout');

    setTimeout(function () {
      $popup.remove();
      $layover.remove();
      $back.remove();
    }, 300);
  };
});