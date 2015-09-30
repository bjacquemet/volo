$(document).ready(function(){
var data_w = [
{
  value: 2,
  color: "rgba(162, 255, 0, 0.95)",
  highlight: "#A2FF00",
  label: "hours this week"
},
{
  value: 0,
  color: "rgba(240, 240, 240, 0.8)",
  highlight: "rgba(240, 240, 240, 0.6)",
  label: "hours remaining"
}
];
var data_m = [
{
  value: 4,
  color:"#666",
  highlight: "#444",
  label: "hours this month"
},
{
  value: 12,
  color: "rgba(240, 240, 240, 0.8)",
  highlight: "rgba(240, 240, 240, 0.6)",
  label: "hours remaining"
}
];
var global=
{
  labels: [""],
  datasets:
  [
  {
  fillColor: "rgba(162, 255, 0, 0.9)",
  strokeColor: "rgba(162, 255, 0, 0.9)",
  highlightFill: "rgba(162, 255, 0, 1)",
  highlightStroke: "rgba(162, 255, 0, 1)",
  data:[620]}
  ]
};
window.onload = function()
  {
    var totalHours = 0,
        top = 0,
        barHeight = 300,
        goal = 500;
    $.getJSON('/activity/totalHours', function (hours) {
        totalHours = hours[0].totalHours;
        if (totalHours < 90) {
          totalHours = (totalHours * barHeight)/goal + 20;
        }
        else {
          totalHours = (totalHours * barHeight)/goal;
        }
        if (totalHours >= barHeight) totalHours = barHeight;
        top = barHeight-totalHours;
        console.log(top);
        console.log(totalHours);
        setTimeout(function () {
          $('#totalGoal').animate({
            height: totalHours,
            top: top});
          }, 500);
    });
    var week = $('#w_goal').get(0).getContext("2d");
    var newChart = new Chart(week).Doughnut(data_w, {animationEasing : "easeInQuad", animationSteps : 50,   tooltipTemplate: "<%=value%> <%if(label){%><%=label%><%}%>", maintainAspectRatio: true, responsive: true});
    var hours = 20;
    var height = hours*2;
    var y = 200 - height;
    $('#current_hours').animate({y: y, height: height});
  };
});