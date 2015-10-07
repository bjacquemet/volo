$(document).ready(function() {
  $.ajax({
    dataType: "json",
    url: '/volunteer/list',
    success: function(data){
      $.each(data, function(){
        var v_url = '/volunteer/'+ this._id;
        var v_first_name = this.first_name;
        var v_photo = this.photo.cropedPath || this.photo.originalPath;
        $('.volunteer_list').append(
          '<div class="col-md-3 col-sm-3 col-xs-12 unique_volunteer"> \
            <a href="'+v_url+'"> \
              <div class="col-md-12 col-sm-12 col-xs-12 text-center user-bg"> \
                <div class=\'greenify\' style=\'background-image:url("'+ v_photo+'")\'></div> \
                 <p class="volunteer_name">'+ v_first_name +'</p> \
              </div> \
            </a> \
          </div>');
      });
    },
    error: function(err) {
      console.log(err);
    }
  });
});