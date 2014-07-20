var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var LocationSchema = Schema({
  latitude : Number,
  longitude : Number,
  date : Date
})

var Location = mongoose.model("LocationLog", LocationSchema);

LocationModel = function(){};

LocationModel.prototype.AddLocation = function(coords, callback){

  var location = new Location({latitude : coords.latitude, longitude : coords.longitude, date :  coords.date});
  location.save(function(err){
      console.log("ADDING LOCATION IN MODEL");
    callback(err);
  });
}

LocationModel.prototype.GetLocations = function(callback){
  Location.find({}, function(err, locations){
    callback(null, locations);
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

exports.LocationModel = LocationModel;