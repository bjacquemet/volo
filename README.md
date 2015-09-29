# VOLO

### Before starting
You should make sure you have heroku variables in your local environment. Copy the following heroku variables:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- EMAIL_PASS    
- EMAIL_USER
Prompt heroku variables thanks to:
```sh
$ heroku config
```
Add these variables in a ".env" file (already added to gitignore)

### Start app
Run the command
```sh
$ heroku local
```

### Add seeds data
Execute the following command:
```sh
$ mongo localhost/volo seed.js
```
*Note that you may have to change the db depending on your config*

### Developing with git branches
We are going to use branches to develop the different features.

##### Branch naming: pivotal_tracker_id_ticket

We use Pivotal Tracker for managing tasks/tickets. (https://www.pivotaltracker.com/n/projects/1421402). \
When starting a ticket, we would create a new branch, named with the ticket. For example, if tickets has ID **#102650208**, we would name the branch **iss102650208**.

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

#### /volunteer/photo/:id
- Method: GET
- Params: id (volunteer._id_)

Returns the profile picture of a given volunteer.