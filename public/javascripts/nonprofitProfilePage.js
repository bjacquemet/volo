$(document).ready(function() {
  var id_nonprofit = $('.volunteer_list').attr('id').substr(3);
  $.ajax({
    dataType: "json",
    url: '/experience/volunteersByNonprofit/'+ id_nonprofit,
    success: function(data){
    if (data.length > 0)
      {
        $('.volunteer_list').before('<h3 class="text-center col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">Our fantastic volunteers</h3>');
        if (data.length == 1) {
          $('.volunteer_list').append(
            '<div class="col-md-4 col-sm-4 col-xs-6 unique_volunteer"> \
            </div>');
          $.each(data, function(volunteer){
            var v_url = '/volunteer/'+ this._id;
            var v_first_name = this.first_name;
            var v_photo = this.photo.cropedPath || this.photo.originalPath;
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
            var v_url = '/volunteer/'+ this._id;
            var v_first_name = this.first_name;
            var v_photo = this.photo.cropedPath || this.photo.originalPath;
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
            var v_url = '/volunteer/'+ this._id;
            var v_first_name = this.first_name;
            var v_photo = this.photo.cropedPath || this.photo.originalPath;
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
            var v_url = '/volunteer/'+ this._id;
            var v_first_name = this.first_name;
            var v_photo = this.photo.cropedPath || this.photo.originalPath;
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