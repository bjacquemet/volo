$(document).ready(function(){
window.onload = function()
  {
    // TOTAL HOURS
    var totalHours = 0,
        top = 0,
        barHeight = 300,
        goal = 500;
    $.getJSON('/activity/totalHours', function (hours) {
      if (hours.length > 0) {
        totalHours = hours[0].totalHours;
        if (totalHours < 90) {
          totalHours = (totalHours * barHeight)/goal + 20;
        }
        else {
          totalHours = (totalHours * barHeight)/goal;
        }
        if (totalHours >= barHeight) totalHours = barHeight;
        top = barHeight-totalHours;
        setTimeout(function () {
          $('#totalGoal').animate({
            height: totalHours,
            top: top});
          }, 500);
      }
    }).fail();
    // END TOTAL HOURS

    // WEEKLY HOURS
    var weeklyHours = 0,
        remainingHours = 0,
        weeklyLabel = 'hours',
        remainingLabel = 'hours remaining',
        data_w = [];
    $.getJSON('/activity/weeklyHours', function (hours) {
      if (hours.length > 0){
        weeklyHours = hours[0].weeklyHours;
        if (weeklyHours === 0) {
          remainingHours = 2;
        }
        else if (weeklyHours == 1) {
          remainingHours = 1;
          weeklyLabel = 'hour';
          remainingLabel = 'hour remaining';
        }
        else {
          remaining = 0;
          $('.w_goal_achieved').show();
        }
        data_w = [
        {
          value: weeklyHours,
          color: "rgba(162, 255, 0, 0.95)",
          highlight: "#A2FF00",
          label: weeklyLabel
        },
        {
          value: remainingHours,
          color: "rgba(240, 240, 240, 0.8)",
          highlight: "rgba(240, 240, 240, 0.6)",
          label: remainingLabel
        }
        ];
      }
      else {
        data_w = [
        {
          value: 0,
          color: "rgba(162, 255, 0, 0.95)",
          highlight: "#A2FF00",
          label: weeklyLabel
        },
        {
          value: 2,
          color: "rgba(240, 240, 240, 0.8)",
          highlight: "rgba(240, 240, 240, 0.6)",
          label: remainingLabel
        }
        ];
      }
      var week = $('#w_goal').get(0).getContext("2d");
      var newChart = new Chart(week).Doughnut(data_w, {animationEasing : "easeInQuad", animationSteps : 50,   tooltipTemplate: "<%=value%> <%if(label){%><%=label%><%}%>", maintainAspectRatio: true, responsive: true});
    }).fail();
  };
});