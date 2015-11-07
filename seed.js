var Skill = require('./models/skill');
var Role = require('./models/role');
var University = require('./models/university');
var Nonprofit = require('./models/nonprofit');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongo_uri, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + config.mongo_uri + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + config.mongo_uri);
        console.log ('Running on port: ' + config.theport);
    }
});

var sbv = false;
var baptiste_id = mongoose.Types.ObjectId('5615128e373b391c00c260fb');

// Seed for skills
// db.skills.drop();
var s = [
    "Active Listening",
    "Adaptability",
    "Analysis",
    "Budgeting",
    "Campaign Management",
    "Collaboration",
    "Commercial Awareness",
    "Communication",
    "Creativity",
    "Crisis Management",
    "Cultural Awareness",
    "Customer Service",
    "Data Management",
    "Deadline Management",
    "Decision Making",
    "Design",
    "Empathy",
    "Innovation",
    "Leadership",
    "Marketing",
    "Mobile Development",
    "Motivating Others",
    "Negotiation",
    "Network and Information Security",
    "Networking",
    "Numeracy",
    "Operations Analysis",
    "Organisational Planning",
    "Problem Solving",
    "Project Management",
    "Public Speaking",
    "Recruiting",
    "Research",
    "Resource Coordination",
    "Sales",
    "Scheduling",
    "Social Media Marketing",
    "Strategic Planning",
    "Strategy",
    "Team Work",
    "Time Management",
    "Translation and Interpreting",
    "Web Development"

];

s.forEach(function (name) {
    var newSkill = Skill(
        {
            name: name,
            suggested_by_volunteer: sbv,
            created_by: baptiste_id
        });
    newSkill.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('OK');
            }
        }
    );
});

// Seed for roles
// db.roles.drop();
var r = [
    "Volunteer Coordinator",
    "Coach",
    "Office Manager",
    "Office Assistant",
    "Fundraiser",
    "Representative",
    "Builder",
    "Developer",
    "Speaker",
    "Project Manager",
    "Designer",
    "Marketing Coordinator",
    "Assistant",
    "Advisor",
    "Counselor",
    "Educator",
    "Gardener",
    "Consultant",
    "Doctor",
    "Nurse",
    "Dentist",
    "Artist",
    "Actor",
    "Mentor",
    "Mentee",
    "Cleaner",
    "Shop assistant",
    "Driver",
    "Customer Service Assistant",
    "Trustee",
    "Writer",
    "Researcher",
    "Team Manager",
    "Trainer",
    "Cook",
    "Server",
    "Photographer",
    "Carer"
];
r.forEach(function (name) {
    var newRole = Role(
        {
            name: name,
            suggested_by_volunteer: sbv,
            created_by: baptiste_id
        });
    newRole.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('OK');
            }
        }
    );
});

// Seeds for universities
// db.universities.drop();
var u = [
    "Anglia Ruskin University",
    "Arts University Bournemouth",
    "Aston University",
    "Bath Spa University",
    "Birkbeck, University of London",
    "Birmingham City University",
    "Bishop Grosseteste University",
    "Bournemouth University",
    "BPP University",
    "Brunel University",
    "Buckinghamshire New University",
    "Canterbury Christ Church University",
    "City University London",
    "Courtauld Institute of Art",
    "Coventry University",
    "Coventry University, London",
    "Cranfield University",
    "De Montfort University",
    "Durham University",
    "Edge Hill University",
    "Falmouth University",
    "Goldsmiths, University of London",
    "Harper Adams University",
    "Heythrop College",
    "HULT International Business School",
    "Imperial College London",
    "Institute of Cancer Research",
    "Keele University",
    "King's College London",
    "Kingston University",
    "Lancaster University",
    "Leeds Metropolitan University",
    "Leeds Trinity University",
    "Liverpool Hope University",
    "Liverpool John Moores University",
    "London Business School",
    "London Metropolitan University",
    "London School of Economics",
    "London School of Business and Finance",
    "London School of Hygiene & Tropical Medicine",
    "London South Bank University",
    "Loughborough University",
    "Manchester Metropolitan University",
    "Middlesex University",
    "Newcastle University",
    "Newman University",
    "Northumbria University",
    "Norwich University of the Arts",
    "Nottingham Trent University",
    "Open University",
    "Oxford Brookes University",
    "Queen Mary, University of London",
    "Richmond University",
    "Roehampton University",
    "Royal Academy of Music",
    "Royal Agricultural University",
    "Royal Holloway, University of London",
    "Royal Northern College of Music",
    "Royal Veterinary College",
    "School of Advanced Study",
    "School of Oriental and African Studies",
    "School of Pharmacy, University of London",
    "Sheffield Hallam University",
    "Southampton Solent University",
    "St George's, University of London",
    "St. Mary's University College",
    "Staffordshire University",
    "Teesside University",
    "Thames Valley University",
    "University College Birmingham",
    "University College London",
    "University for the Creative Arts",
    "University of Bath",
    "University of Bedfordshire",
    "University of Birmingham",
    "University of Bolton",
    "University of Bradford",
    "University of Brighton",
    "University of Bristol",
    "University of Buckingham",
    "University of Cambridge",
    "University of Central Lancashire",
    "University of Chester",
    "University of Chichester",
    "University of Cumbria",
    "University of Derby",
    "University of East Anglia",
    "University of East London",
    "University of Essex",
    "University of Exeter",
    "University of Gloucestershire",
    "University of Greenwich",
    "University of Hertfordshire",
    "University of Huddersfield",
    "University of Hull",
    "University of Kent",
    "University of Leeds",
    "University of Leicester",
    "University of Lincoln",
    "University of Liverpool",
    "University of London",
    "University of Manchester",
    "University of Northampton",
    "University of Nottingham",
    "University of Oxford",
    "University of Plymouth",
    "University of Portsmouth",
    "University of Reading",
    "University of Salford",
    "University of Sheffield",
    "University of Southampton",
    "University of St Mark & St John",
    "University of Sunderland",
    "University of Surrey",
    "University of Sussex",
    "University of the Arts London",
    "University of the West of England",
    "University of Warwick",
    "University of Westminster",
    "University of Winchester",
    "University of Wolverhampton",
    "University of Worcester",
    "University of York",
    "York St John University"
];
u.forEach(function (name) {
    var newUniversity = University(
        {
            name: name,
            suggested_by_volunteer: sbv,
            created_by: baptiste_id
        });
    newUniversity.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('OK');
            }
        }
    );
});


// Seeds for nonprofit
// db.nonprofits.drop();
var n = [
    "Anglia Ruskin University",
    "Arts University Bournemouth",
    "University of the Arts London",
    "Aston University",
    "University of Bath",
    "Bath Spa University",
    "University of Bedfordshire",
    "University of Birmingham",
    "Birmingham City University",
    "University College Birmingham",
    "Bishop Grosseteste University",
    "University of Bolton",
    "Bournemouth University",
    "BPP University",
    "University of Bradford",
    "University of Brighton",
    "University of Bristol",
    "Brunel University",
    "University of Buckingham",
    "Buckinghamshire New University",
    "University of Cambridge",
    "Canterbury Christ Church University",
    "University of Central Lancashire",
    "University of Chester",
    "University of Chichester",
    "City University London",
    "Coventry University",
    "Cranfield University",
    "University for the Creative Arts",
    "University of Cumbria",
    "De Montfort University",
    "University of Derby",
    "Durham University",
    "University of East Anglia",
    "University of East London",
    "Edge Hill University",
    "University of Essex",
    "University of Exeter",
    "Falmouth University",
    "University of Gloucestershire",
    "University of Greenwich",
    "Harper Adams University",
    "University of Hertfordshire",
    "University of Huddersfield",
    "University of Hull",
    "Imperial College London",
    "Keele University",
    "University of Kent",
    "Kingston University",
    "Lancaster University",
    "University of Leeds",
    "Leeds Metropolitan University",
    "Leeds Trinity University",
    "University of Leicester",
    "University of Lincoln",
    "University of Liverpool",
    "Liverpool Hope University",
    "Liverpool John Moores University",
    "University of London",
    "Birkbeck, University of London",
    "Courtauld Institute of Art",
    "Goldsmiths, University of London",
    "Heythrop College",
    "Institute of Cancer Research",
    "King's College London",
    "London Business School",
    "London School of Economics",
    "London School of Hygiene & Tropical Medicine",
    "Queen Mary, University of London",
    "Royal Northern College of Music",
    "Royal Academy of Music",
    "Royal Holloway, University of London",
    "Royal Veterinary College",
    "St George's, University of London",
    "School of Advanced Study",
    "School of Oriental and African Studies",
    "School of Pharmacy, University of London",
    "University College London",
    "London Metropolitan University",
    "London South Bank University",
    "Loughborough University",
    "University of Manchester",
    "Manchester Metropolitan University",
    "Middlesex University",
    "Newcastle University",
    "Newman University",
    "University of Northampton",
    "Northumbria University",
    "Norwich University of the Arts",
    "University of Nottingham",
    "Nottingham Trent University",
    "Open University",
    "University of Oxford",
    "Oxford Brookes University",
    "University of Plymouth",
    "University of Portsmouth",
    "University of Reading",
    "Richmond University",
    "Roehampton University",
    "Royal Agricultural University",
    "University of Salford",
    "University of Sheffield",
    "Sheffield Hallam University",
    "University of Southampton",
    "Southampton Solent University",
    "University of St Mark & St John",
    "St. Mary's University College",
    "Staffordshire University",
    "University of Sunderland",
    "University of Surrey",
    "University of Sussex",
    "Teesside University",
    "Thames Valley University",
    "University of Warwick",
    "University of Westminster",
    "University of the West of England",
    "University of Winchester",
    "University of Wolverhampton",
    "University of Worcester",
    "University of York",
    "York St John University",
    "Age UK ",
    "Barnardo's ",
    "British Heart Foundation",
    "British Red Cross",
    "Butterfly Conservation  ",
    "Cancer Research UK",
    "Chance UK",
    "Christian Aid",
    "ELBA - East London Business Alliance",
    "English Heritage",
    "The Scout Association ",
    "Great Ormond Street Hospital ",
    "Habitat for Humanity",
    "UNICEF",
    "London Wildlife Trust",
    "Macmillan Cancer Support",
    "Water Aid",
    "Mind",
    "Vision Care for Homeless People",
    "Mosaic Mentoring",
    "National Trust",
    "NSPCC",
    "OXFAM ",
    "Royal London Society for the Blind",
    "Royal Society for the Protection of Birds",
    "Royal Voluntary Service ",
    "RSPCA - Royal Society for the Prevention of Cruelty to Animals ",
    "Samaritans",
    "Save the Children",
    "SPEAR",
    "STAR - Student Action for Refugees ",
    "The Boys' Brigade",
    "Mencap",
    "Action for Children",
    "The Salvation Army",
    "Leonard Cheshire Disability",
    "St Andrew's Healthcare",
    "RNLI - The Royal National Lifeboat Institution",
    "The Royal British Legion",
    "Marie Curie Cancer Care",
    "Oasis UK",
    "The National Autistic Society",
    "RNIB - Royal National Institute of Blind People",
    "Sense",
    "Alzheimer's Society",
    "Actionaid",
    "Dogs Trust",
    "Enactus",
    "Spitalfields Farm Association"
];
n.forEach(function (name) {
    var newNonprofit = Nonprofit(
        {
            name: name,
            suggested_by_volunteer: sbv,
            created_by: baptiste_id
        });
    newNonprofit.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('OK');
            }
        }
    );
});