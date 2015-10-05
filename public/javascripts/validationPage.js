$(document).ready(function() {
  $(".btn-validate").on('click', function () {
    var activityID = $(this).data('activity');
    var referee = $(this).data('referee');
    $(".referee").val(referee);
    $(".activityId").val(activityID);
  });

  $('.btn-decline').on('click', function () {
    var activityID = $(this).data('activity');
    $(".activityId").val(activityID);
  });

  $('#acceptModal form').submit(function(event) {
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

  $('#declineModal form').submit(function(event) {
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