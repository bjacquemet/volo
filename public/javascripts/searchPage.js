$(document).on('ready', function () {
  $('form').submit(function (){
    $input = $(this).find('input');
    if ($input.val().substr($input.val().length - 1) == ' ')
      {
        $input.val($input.val().substr(0, $input.val().length-1));
      }
  });
  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
  };
  if ($.urlParam("search") !== 0) $('input').val(decodeURIComponent($.urlParam("search")).replace(/\+$/, '').replace(/\+|\%2B/g, ' '));
});