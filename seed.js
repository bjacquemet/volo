// Seed for skills
db.skills.drop();
var s = ['Communication', 'Team Work', 'Customer Service', 'Project Leadership'];
s.forEach(function(name){
  db.skills.save({name: name});
});

// Seed for roles
db.roles.drop();
var r = ['Office Assistant', 'Web Developer', 'Events volunteer'];
r.forEach(function(name){
  db.roles.save({name: name});
});

// Seed for nonprofits
db.nonprofits.drop();
var n = ['Habitat for Humanity', 'British Red Cross', 'ABL Health'];
n.forEach(function(name){
  db.nonprofits.save({name: name});
});