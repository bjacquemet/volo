$(document).ready(function() {

  $("#editActivityModal").on('hide.bs.modal', function () {
    if ($("#editActivityModal .skills_list").data('select2'))
      {
        $("#editActivityModal .skills_list").select2('close');
        $("#editActivityModal .role").select2('close');
      }
  });

$('.editForm').submit(function(event) {
  event.preventDefault();
  var $this = $(this);
  $(this).ajaxSubmit({
    error: function(xhr) {
      console.log(xhr);
    },
    success: function(response) {
      $this.parent().closest('.modal').modal('toggle');
    }
  });
});
function lowerToCapitalize(str){
return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$('.activity').on('click', function () {
  if ($(this).data("validated") == "pending")
    {
      $.ajax({
        dataType: "json",
        url: '/activity/get/' + $(this).data("id"),
        success: function(data){
        $('#editActivityModal').modal('toggle');
        $("#editActivityModal").on('shown.bs.modal', function () {
          $(".skills_list").select2({
            placeholder: "Select up to 3 skills",
            maximumSelectionLength: 3,
            language: {
              maximumSelected: function () {
                return 'Sorry, you can only select up to 3 skills';
              }
            }
          });
          $(".role").select2({
            placeholder: "Select a role",
          });
          var newDate = new Date(data.start_date);
          var y = newDate.getFullYear();
          var m = newDate.getMonth() + 1;
          if (m <10) m = '0'+m;
          var d = newDate.getDate();
          if (d <10) d = '0'+d;
          $('#editActivityModal input[name=s_date]').val(y+'-'+m+'-'+d);
          if (data.end_date)
            {
            var endDate = new Date(data.end_date);
            var y_e = endDate.getFullYear();
            var m_e = endDate.getMonth() + 1;
            if (m_e <10) m_e = '0'+m_e;
            var d_e = endDate.getDate();
            if (d_e <10) d_e = '0'+d_e;
            $('#editActivityModal input[name=e_date]').val(y_e+'-'+m_e+'-'+d_e);
            }
          $('#editActivityModal input[name=activity]').val(data._id);
          $('#editActivityModal .role').select2('val', data.role._id);
          $('#editActivityModal .skills_list').select2('val', data.skills_list);
          $('#editActivityModal input[name=hours]').val(data.hours);
          $('#editActivityModal textarea[name=notes]').val(data.notes);
          $('#editActivityModal p.referee_name').text(data.referee.name);
          $('#editActivityModal p.referee_email').text(data.referee.email);
          $('#editActivityModal p.referee_info').text(data.referee.email + ' - ' + data.referee.phone_number);
          if (data.validated_via_email) $('#editActivityModal p.referee_info').append("<br/><em>To be validated via email</em>");
        });
        },
        error: function(err) {
          console.log(err);
        }
      });
    }
    else
      {
        $.ajax({
          dataType: "json",
          url: '/activity/get/' + $(this).data("id"),
          success: function(data){
          $('#checkActivityModal').modal('toggle');
          $("#checkActivityModal").on('shown.bs.modal', function () {
            var newDate = new Date(data.start_date);
            var y = newDate.getFullYear();
            var m = newDate.getMonth() + 1;
            if (m <10) m = '0'+m;
            var d = newDate.getDate();
            if (d <10) d = '0'+d;
            $('#checkActivityModal p.s_date_data em').text(d+'/'+m+'/'+y);
            if (data.end_date)
              {
              var endDate = new Date(data.end_date);
              var y_e = endDate.getFullYear();
              var m_e = endDate.getMonth() + 1;
              if (m_e <10) m_e = '0'+m_e;
              var d_e = endDate.getDate();
              if (d_e <10) d_e = '0'+d_e;
              $('#checkActivityModal p.e_date_data em').text(d_e+'/'+m_e+'/'+y_e);
              }
            $('#checkActivityModal input[name=activity]').val(data._id);
            $('#checkActivityModal p.role_data em').text(lowerToCapitalize(data.role.name));
            $('#checkActivityModal p.skills_data em').text(lowerToCapitalize(data.skills_list_name.join(', ')));
            $('#checkActivityModal p.hours_data em').text(data.hours);
            $('#checkActivityModal textarea[name=notes]').val(data.notes);
            $('#checkActivityModal p.referee_name').text(data.referee.name);
            $('#checkActivityModal p.referee_info').text(data.referee.email + ' - ' + data.referee.phone_number);
            if (data.validated_via_email) $('#checkActivityModal p.referee_info').append("<br/><em>To be validated via email</em>");
          });
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
});
  
  //- Editable set up
  $('#first_name').editable({emptytext: 'First Name'});
  $('#last_name').editable({emptytext: 'Last Name'});
  $('#graduate').editable({
    emptytext: 'Level',
    source: [
          {value:"undergraduate", text:"Undergraduate"},
          {value:"postgraduate", text:"Postgraduate"},
        ]
    });
  $('#graduation_year').editable({emptytext: 'Graduation year'});
  $('#degree').editable({emptytext: 'Degree'});
  $('#area_of_study').editable({
    emptytext: 'Area Of Study',
    source: 
      [
      {value:'Arts and Literature', text: 'Arts and Literature'},
      {value:'Astronomy / Astrophysics / Space Science', text: 'Astronomy / Astrophysics / Space Science'},
      {value:'Biological Sciences', text: 'Biological Sciences'},
      {value:'Business Administration', text: 'Business Administration'},
      {value:'Chemistry', text: 'Chemistry'},
      {value:'Computer and Information Science', text: 'Computer and Information Science'},
      {value:'Design', text: 'Design'},
      {value:'Earth Sciences', text: 'Earth Sciences'},
      {value:'Economics', text: 'Economics'},
      {value:'Education', text: 'Education'},
      {value:'Electrical and Electronic Engineering', text: 'Electrical and Electronic Engineering'},
      {value:'Engineering', text: 'Engineering'},
      {value:'Environmental Sciences', text: 'Environmental Sciences'},
      {value:'Humanities', text: 'Humanities'},
      {value:'Law', text: 'Law'},
      {value:'Linguistics', text: 'Linguistics'},
      {value:'Management Science / Operations Research', text: 'Management Science / Operations Research'},
      {value:'Materials Science', text: 'Materials Science'},
      {value:'Mathematics', text: 'Mathematics'},
      {value:'Medicine', text: 'Medicine'},
      {value:'Philosophy', text: 'Philosophy'},
      {value:'Physics', text: 'Physics'},
      {value:'Psychology', text: 'Psychology'},
      {value:'Social Sciences', text: 'Social Sciences'},
      {value:'Sports and Recreation', text: 'Sports and Recreation'}
      ]
    });
  $('#email').editable({
    emptytext: 'Email',
    validate: function(value) {
        if($.trim(value) === '') {
            return "This field can't be empty required";
        }
    },
    success: function(response, newValue) {
      if(response.status == 'error') return response.msg;
    }
    });
  $('#phone').editable({
    emptytext: 'Phone Number', 
    validate: function (value) {
      if (/^[0-9 \-()+]{3,20}$|(^$)/i.test(value) === false) {
        return  'Please enter a valid phone number';
      }
    },
    success: function(response, newValue) {
      if (response.status == 'error') return response.msg;
    }
  });
  $('#company').editable({emptytext: 'Company'});
  $('#about').editable({emptytext: 'About Me'});
  $('#about').on('shown', function(e, editable){
      $('.editable-container').css("width", "90%");
      $('.form-group').css("width", "90%");
      $('.editable-input').css("width", "90%");
      $('textarea').css("width", "100%");
      });
  $('#city').editable({emptytext: 'City'});
  $('#position').editable({
    emptytext: 'Position',
    source: [
          {value:"student", text:"Student"},
          {value:"employed", text:"Employed"},
          {value:"unemployed", text:"Unemployed"}
        ]
  });
  $("#position").on('save', function(e, params){
      switch(params.newValue)
        {
          case 'student':
            location.reload();
            break;
          case 'unemployed':
            location.reload();
            break;
          case "employed":
            location.reload();
            break;
        }
      //- Reload to avoid building the page with JS. Not a satisfying method -> MEAN
    });
  $('#birthdate').editable({
    format: 'YYYY-MM-DD',    
    viewformat: 'DD/MM/YYYY',    
    template: 'D / MMMM / YYYY',    
    combodate: {
          maxYear: 1999, 
          minYear: 1920
     },
     emptytext: 'Birthdate'
  });
  $('#gender').editable({
    emptytext: "Gender",
    source: [
          {value:"male", text:"Male"},
          {value:"female", text:"Female"}
        ]
  });

  $('#university').editable({
    emptytext: 'University',
    source: "/university/list",
    sourceCache: false
  });

  $('#universityForm').submit(function(event){
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function(xhr) {
      console.log(xhr);
        $('#universityModal .modal-body').prepend('<div class="alert alert-danger"> \
          <div>'+ xhr.responseText + '</div> \
          <div>Sorry, you can\'t add this university. Please, contact us if you think you should.</div> \
          </div>');
      },
      success: function(response) {
        $('#universityModal').modal('toggle');
        $('#universityForm').find('input[name=name]').val('');
      }
    });
  });

  $('.xp_description').editable({emptytext: 'Describe your Experience'});
  $('.xp_description').on('shown', function(e, editable){
      $('.editable-container').css("width", "90%");
      $('.form-group').css("width", "90%");
      $('.editable-input').css("width", "90%");
      $('textarea').css("width", "100%");
      });
  
  // Preload external data function for skills + role
  function loadExternalData(listName, id) {
    $.getJSON('/'+listName+'/list', function(listName) {
      $(id).empty();
      if (listName) {
        $(id).append('<option></option>');
        $.each(listName, function(i, val){
          $(id).append('<option value='+ val._id + '>'+ val.name +'</option>');
        });
      } 
    });
  }

  // Prepare form to add new skill

  loadExternalData('skill', ".skills_list");
  loadExternalData('role', ".role");
  loadExternalData('nonprofit', "#nonprofit");
  
  // Add experience form open and set up of select2 tags
  $('#addXP').on('click', function(e){
    e.preventDefault();
    $(".XP_form").fadeIn();
    $(".skills_list").select2({
      placeholder: "Select up to 3 skills",
      maximumSelectionLength: 3,
      language: {
        maximumSelected: function () {
          return 'Sorry, you can only select up to 3 skills';
        }
      }
    });
    
    $(".role").select2({
      placeholder: "Select a role",
    });

    // Nonprofit modal
    $("#nonprofit").select2({
      placeholder: "Select a nonprofit",
    });
    $('#nonprofitForm').submit(function(event){
      event.preventDefault();
      $(this).ajaxSubmit({
        error: function(xhr) {
        console.log(xhr);
          $('#nonprofitModal .modal-body').prepend('<div class="alert alert-danger"> \
            <div>'+ xhr.responseText + '</div> \
            <div>Sorry, you can\'t add this nonprofit. Please, contact us if you think you should.</div> \
            </div>');
        },
        success: function(response) {
          loadExternalData('nonprofit', "#nonprofit");
          $('#nonprofitModal').modal('toggle');
          $('#nonprofitForm').find('input[name=name]').val('');
        }
      });
    });

    $('html, body').animate({
        scrollTop: $(".XP").offset().top
      }, "slow");
    if ($(".activity_form").is(":visible")) {
      $(".add_new").on('click', showActivity);
      $(".activity_form:visible").hide().removeClass('height-auto').parent().addClass('text-center').removeClass('no-hover').parent().switchClass("col-md-12", "col-md-6", 500, function(){
      $(".add_new").removeClass('hide_it').show();
      });
    }
  });
  
  //- Skill Form
  $('#skillForm').submit(function(event){
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function(xhr) {
        $('#skillModal .modal-body').prepend('<div class="alert alert-danger"> \
          <div>'+ xhr.responseText + '</div> \
          <div>Sorry, an error occurred while the request. Please, contact us if you experience more problems.</div> \
          </div>');
      },
      success: function(response) {
        // loadExternalData('skill', ".skills_list");
        $('#skillModal').modal('toggle');
        $('#skillForm').find('input[name=name]').val('');
        $('body').prepend('<div class="alert alert-success sticky text-center"> \
          <h4>Thanks for suggesting a skill. A request has been sent to the administrator.</h4></div>');
        setTimeout(function () {$('.alert.alert-success.sticky.text-center').remove();}, 3500 );
      }
    });
  });

  //- Role Form
  $('#roleForm').submit(function(event){
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function(xhr) {
        $('#roleModal .modal-body').prepend('<div class="alert alert-danger"> \
          <div>'+ xhr.responseText + '</div> \
          <div>Sorry, you can\'t add this role. Please, contact us if you think you should.</div> \
          </div>');
      },
      success: function(response) {
        loadExternalData('role', ".role");
        $('#roleModal').modal('toggle');
        $('#roleForm').find('input[name=name]').val('');
      }
    });
  });

  function showActivity (element) {
    $(element).find(".add_new").hide().addClass('hide_it');
    $(element).find(".activity_form").show().addClass('height-auto').parent().removeClass('text-center').addClass('no-hover').parent().switchClass("col-md-6", "col-md-12", 500, function () {
        $('html, body').animate({
          scrollTop: $(element).find(".activity_form").offset().top
        }, "slow");
        $(".skills_list").select2({
          placeholder: "Select up to 3 skills",
          maximumSelectionLength: 3,
          language: {
            maximumSelected: function () {
              return 'Sorry, you can only select up to 3 skills';
            }
          }
        });
        $(".role").select2({
          placeholder: "Select a role",
        });
      });
  }

  $(".add_new").on('click', function(e){
    e.preventDefault();
    if ($('.XP_form').is(':visible')) {
      $('.XP_form').hide();
      $('html, body').animate({
          scrollTop: $(".activity_form").offset().top
        }, "slow");
    }
    showActivity($(this).parent());
    $(this).off('click', showActivity);
  });

  //-  Add validation that end date > start date
  $("input[name*=s_date]").focusout(function() {
    $('input[name*=e_date]').attr('min', $(this).val());
  });

  $('.XP_form form').submit(function(event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function(xhr) {
        console.log(xhr);
      },
      success: function(response) {
        $('body').prepend('<div class="alert alert-success sticky text-center"> \
          <h4>Your experience has been added successfully!</h3></div>');
        setTimeout(function () {location.reload();}, 1600 );
      }
    });
  });

  $('.activity_form').submit(function(event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function(xhr) {
        console.log(xhr);
      },
      success: function(response) {
        $('body').prepend('<div class="alert alert-success sticky text-center"> \
          <h4>Your activity has been added successfully!</h3></div>');
        setTimeout(function () {location.reload();}, 1600 );
      }
    });
  });

  // adding method to validate max size
  jQuery.validator.addMethod("uploadFile", function (val, element) {
            var size = element.files[0].size;
            if (size < 4194304)// checks the file is less than 4MB
            {
              return true;
            } else {
              return false;
            }
        }, "File type error");

  // Validate photo form
  $('#uploadForm').validate({
      rules: {
          userPhoto: {
              required: true,
              extension: "png|jpg|gif|jpeg",
              uploadFile: true
          }
      },
      messages: {
          userPhoto: {
              required: "Please upload a new photo",
              extension: "Please upload a valid image file",
              uploadFile: "Please make sure that your picture is smaller than 4M"
          }
      }
  });

  $('#uploadForm').submit(function() {
    $('span.glyphicon-refresh-animate').removeClass('hidden');
    $(this).ajaxSubmit({
      error: function(xhr) {
        console.log(xhr);
      },
      success: function(response) {
        var $newFile = "/"+response+'?dim=400x400';
        $('#uploadModal').modal('toggle');
        $(".user-bg img").attr('src',$newFile);
        $('span.glyphicon-refresh-animate').addClass('hidden');
      }
    });
    return false;
  });   

  $('.reco').on("click", function(e){
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $(".recommendation").offset().top
    }, "slow");
  });

  var today = new Date(); 
  var year = today.getFullYear();
  var month = today.getMonth()+1;
  if (month <10) month = '0'+month;
  var day = today.getDate()+1;
  if (day <10) day = '0'+day;

  $('input[name="s_date"]').attr("max", year+"-"+month+'-'+day).attr('min', '2010-01-01');
  $('input[name="e_date"]').attr("max", year+"-"+month+'-'+day);
  
  $('.little').on('click', function () {
    if ($('#editActivityModal').hasClass('in') === true)
      {
        $('#editActivityModal').modal('hide');
      }
  });

  $(':input[type=number]').on('mousewheel', function(e){
      e.preventDefault();
  });
  $(':input[type=date]').on('mousewheel', function(e){
      e.preventDefault();
  });

  // country selector
  var countries = [];
  $.each([
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Côte d'Ivoire",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Faeroe Islands",
  "Falkland Islands",
  "Fiji",
  "Finland",
  "Former Yugoslav Republic of Macedonia",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard and Mc Donald Islands",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "North Korea",
  "Northern Marianas",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn Islands",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "São Tomé and Príncipe",
  "Saint Helena",
  "St. Pierre and Miquelon",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen Islands",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "The Bahamas",
  "The Gambia",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "US Virgin Islands",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Wallis and Futuna Islands",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"],
   function(k,v) {
      countries.push({value: v,
       text: v});
  }); 
  $('#country').editable({
    emptytext: "Country",
    defaultValue: "United Kingdom",
    source: countries
  }); 

  $('.modal').on('shown.bs.modal', function () {
    $(this).find('input:text:visible:first').focus();
  });
});
