function trackOutboundClick(e) {
    var $link = $(e.currentTarget);
    var url = $link.attr('href');
    ga('send', 'event', 'outbound', 'click', url, {
        'hitCallback': function() {
            document.location = url;
        }
    });
}

$(document).ready(function(){
  var url = window.location;
  $('ul.nav a[href="'+ url +'"]').parent().addClass('active');
  $('ul.nav a').filter(function() {
      return this.href == url;
  }).parent().addClass('active');
  $('[rel="external"]').on('click', trackOutboundClick);
});