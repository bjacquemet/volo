$(document).ready(function() {
  $.ajax({
    dataType: "json",
    url: '/experience/volunteersByNonprofit/5603b6b2092d76675a3433b2',
    success: function(data){
    if (data.length > 0)
      {
        if (data.length == 1) {
          $('.volunteer_list').append(
            '<div class="col-md-4 col-sm-4 col-xs-6 unique_volunteer"> \
            </div>');
          $.each(data, function(){
            var v_url = '/volunteer/'+ this.volunteer._id;
            var v_first_name = this.volunteer.first_name;
            var v_photo = this.volunteer.photo.cropedPath || this.volunteer.photo.originalPath;
            $('.volunteer_list').append(
              '<div class="col-md-4 col-sm-4 col-xs-6 unique_volunteer"> \
                <a href="'+v_url+'"> \
                  <div class="col-md-12 col-sm-12 col-xs-12 text-center user-bg"> \
                    <div class=\'greenify\' style=\'background-image:url("'+ v_photo+'")\'></div> \
                     <p class="volunteer_name">'+ v_first_name +'</p> \
                  </div> \
                </a> \
              </div>');
          });
          }
        else if (data.length == 2){
          $('.volunteer_list').append(
            '<div class="col-md-3 col-sm-3 col-xs-6"> \
            </div>');
          $.each(data, function(){
            var v_url = '/volunteer/'+ this.volunteer._id;
            var v_first_name = this.volunteer.first_name;
            var v_photo = this.volunteer.photo.cropedPath || this.volunteer.photo.originalPath;
            $('.volunteer_list').append(
              '<div class="col-md-3 col-sm-3 col-xs-6 unique_volunteer"> \
                <a href="'+v_url+'"> \
                  <div class="col-md-12 col-sm-12 col-xs-12 text-center user-bg"> \
                    <div class=\'greenify\' style=\'background-image:url("'+ v_photo+'")\'></div> \
                     <p class="volunteer_name">'+ v_first_name +'</p> \
                  </div> \
                </a> \
              </div>');
          });
          }
        else if (data.length == 3) {
          $.each(data, function(){
            var v_url = '/volunteer/'+ this.volunteer._id;
            var v_first_name = this.volunteer.first_name;
            var v_photo = this.volunteer.photo.cropedPath || this.volunteer.photo.originalPath;
            $('.volunteer_list').append(
              '<div class="col-md-4 col-sm-4 col-xs-6 unique_volunteer"> \
                <a href="'+v_url+'"> \
                  <div class="col-md-12 col-sm-12 col-xs-12 text-center user-bg"> \
                    <div class=\'greenify\' style=\'background-image:url("'+ v_photo+'")\'></div> \
                     <p class="volunteer_name">'+ v_first_name +'</p> \
                  </div> \
                </a> \
              </div>');
          });
          }
        else {
          $.each(data, function(){
            var v_url = '/volunteer/'+ this.volunteer._id;
            var v_first_name = this.volunteer.first_name;
            var v_photo = this.volunteer.photo.cropedPath || this.volunteer.photo.originalPath;
            $('.volunteer_list').append(
              '<div class="col-md-3 col-sm-3 col-xs-6 unique_volunteer"> \
                <a href="'+v_url+'"> \
                  <div class="col-md-12 col-sm-12 col-xs-12 text-center user-bg"> \
                    <div class=\'greenify\' style=\'background-image:url("'+ v_photo+'")\'></div> \
                     <p class="volunteer_name">'+ v_first_name +'</p> \
                  </div> \
                </a> \
              </div>');
          });
        }
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
});