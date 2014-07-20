var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var LocationSchema = Schema({
  latitude : Number,
  longitude : Number,
  date : Date,

})

var Location = mongoose.model("LocationLog", LocationSchema);

LocationModel = function(){};

LocationModel.prototype.AddLocation = function(coords, callback){

  var location = new Location({latitude : coords.latitude, longitude : coords.longitude, date :  new Date(coords.date)});
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

LocationModel.prototype.GetLocationsByDate = function(date, callback){
    Location.find( //query today up to tonight
      { date: 
        {"$gte": new Date(date.getTime()-60000*5)}
      }, function(err, locations){
        callback(locations);
      }
    )
}

LocationModel.prototype.Filter = function(){
  Location.find({}).remove().exec();
}

exports.LocationModel = LocationModel;