var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var DestinationSchema = Schema({
  latitude : Number,
  longitude : Number,
  contact : String,

})

var Destination = mongoose.model("DestinationLog", DestinationSchema);

DestinationModel = function(){};

DestinationModel.prototype.AddDestination = function(coords, callback){

  var Destination = new Destination({latitude : coords.latitude, longitude : coords.longitude, date :  new Date(coords.date)});
  Destination.save(function(err){
      console.log("ADDING Destination IN MODEL");
    callback(err);
  });
}

DestinationModel.prototype.GetDestinations = function(callback){
  Destination.findOne({}, function(err, Destination){
    callback(null, Destinations);
  });
}
/*
//Find all Classes
ClassModel.prototype.findAll = function(callback) {
  Class.find({}, function (err, Class) {
    callback( null, Class )
  });  
};

//Find Class by ID
ClassModel.prototype.findById = function(id, callback) {
  Class.findById(id, function (err, Class) {
    if (!err) {
    callback(null, Class);
  }
  });
};


//Create a new Class
ClassModel.prototype.save = function(params, callback) {
  var Class = new Class({id : 0, name : params.name, instructor : params.instructor, group : params.group});
  Class.save(function (err) {
    callback();
  });
};
*/

exports.DestinationModel = DestinationModel;