var config = {};

var mongo_uri =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/volo';

config.mongo_uri =  mongo_uri;
config.theport = process.env.PORT || 3000;

module.exports = config;