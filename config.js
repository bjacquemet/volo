var config = {};

config.email = {};

var mongo_uri =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/volo';

config.mongo_uri =  mongo_uri;
config.theport = process.env.PORT || 3000;
config.email.host = 'smtp.mailgun.org';
config.email.service = "Mailgun";
config.email.user = "postmaster@mg.volo.org.uk";
config.email.pass = "18682498971f9e94b4c22b6433284351";
config.url = process.env.HOST || "http://localhost:3000";

module.exports = config;