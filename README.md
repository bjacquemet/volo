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