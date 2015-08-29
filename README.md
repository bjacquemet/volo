# VOLO

### Start app
Run the command
Execute the following command:
```sh
$ npm start
```

### Add seeds data
Execute the following command:
```sh
$ mongo localhost/socialLift seed.js
```
*Note that you may have to change the db depending on your config*

### Endpoints accessible from Postman

#### /skill/list
- Method: GET

Returns a the list of skills

#### /skill/new
- Method: POST
- Params: name

Create a new skill and returns Status 201 if successful (only creates the first one if an array of names is provided)

#### /role/list
- Method: GET

Returns a the list of roles

#### /role/new
- Method: POST
- Params: name 

Create a new role and returns Status 201 if successful (only creates the first one if an array of names is provided)

#### /nonprofit/list
- Method: GET
Returns a the list of roles

#### /nonprofit/new
- Method: POST
- Params: name, suggested_by_volunteer

Create a new nonprofit and returns Status 201 if successful

#### /experience/list
- Method: GET

Returns a the list of experiences

#### /experience/volunteer/:id
- Method: GET
- Params: id (volunteer._id)

Returns a list of experiences of a given volunteer.

#### /experience/new
- Method: POST
- Params: 
    + volunteer (volunteer._id)
    + nonprofit (nonprofit._id)
    + description
    + role (role._id)
    + skills [skills._id]
    + hours
    + s_date
    + e_date
    + referee_name
    + referee_email
    + referee_phone
    + notes

Create a new experience.

#### /activity/list
- Method: GET

Returns a the list of activities

#### /activity/volunteer/:id
- Method: GET
- Params: id (Volunteer _id)

Returns a list of activities of a given volunteer.

#### /activity/new
- Method: POST
- Params: 
    + volunteer (volunteer._id)
    + experience (experience._id)
    + role (role._id)
    + skills [skills._id]
    + hours
    + s_date
    + e_date
    + referee_name
    + referee_email
    + referee_phone
    + notes
    + volunteer

Create a new activity.

#### /volunteer/photo/:email
- Method: GET
- Params: email (volunteer.email)

Returns the profile picture of a given volunteer.