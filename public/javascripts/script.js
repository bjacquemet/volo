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
Chart.defaults.global.responsive = false;
var data = [
{
  value: 35,
  color:"#666",
  highlight: "#444",
  label: "% Completed"
},
{
  value: 65,
  color: "rgba(240, 240, 240, 0.8)",
  highlight: "rgba(240, 240, 240, 0.6)",
  label: "% remaining"
}
]
window.onload = function()
  {
    var happiness = $('#goals').get(0).getContext("2d");
    var newChart = new Chart(happiness).Doughnut(data, {animationEasing : "easeInQuad", animationSteps : 50,   tooltipTemplate: "<%=value%><%if(label){%><%=label%><%}%>"});
  }
});