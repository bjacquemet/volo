$(document).ready(function(){
  var url = window.location;
      // Will only work if string in href matches with location
      $('ul.nav a[href="'+ url +'"]').parent().addClass('active');

      // Will also work for relative and absolute hrefs
      $('ul.nav a').filter(function() {
          return this.href == url;
      }).parent().addClass('active');
});
$(document).ready(function(){
Chart.defaults.global.responsive = true;
var data_w = [
{
  value: 2,
  color:"#666",
  highlight: "#444",
  label: "hours this week"
},
{
  value: 4,
  color: "rgba(240, 240, 240, 0.8)",
  highlight: "rgba(240, 240, 240, 0.6)",
  label: "hours remaining"
}
]
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
]
window.onload = function()
  {
    var week = $('#w_goal').get(0).getContext("2d");
    var newChart = new Chart(week).Doughnut(data_w, {animationEasing : "easeInQuad", animationSteps : 50,   tooltipTemplate: "<%=value%> <%if(label){%><%=label%><%}%>", maintainAspectRatio: true});
    var month = $('#m_goal').get(0).getContext("2d");
    var newChart = new Chart(month).Doughnut(data_m, {animationEasing : "easeInQuad", animationSteps : 50,   tooltipTemplate: "<%=value%> <%if(label){%><%=label%><%}%>", maintainAspectRatio: true});

  }
});