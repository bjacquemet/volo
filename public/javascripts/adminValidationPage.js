$(document).ready(function() {
          $(".btn-validate").on('click', function () {
            var activityID = $(this).data('activity');
            $(".activityId").val(activityID);
          });

          $('form').submit(function(event) {
            event.preventDefault();
            $(this).ajaxSubmit({
              error: function(xhr) {
                console.log(xhr);
              },
              success: function(response) {
                location.reload();
              }
            });
          });
        });