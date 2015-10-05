$(document).ready(function() {
  $('form').validate({
    rules:{
      password: required,
      confirm: {
        equalTo: password
      }
    }
  });
});