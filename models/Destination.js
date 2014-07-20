var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var DestinationSchema = Schema({
  latitude : Number,
  longitude : Number,
  contact : [{number : String, permission : Boolean}],

})

var Destination = mongoose.model("DestinationLog", DestinationSchema);

DestinationModel = function(){};

DestinationModel.prototype.addDestination = function(destination, callback){

  var destination = new Destination(destination);
  destination.save(function(err){
      console.log("ADDING Destination IN MODEL");
  });
}

DestinationModel.prototype.GetDestination = function(callback){
  Destination.find({}, function(err, destination){
    callback(destination[0]);
  });
}

DestinationModel.prototype.ConfirmNumber = function(number, callback){
  Destination.findOne({}, function(err, destination){
      for(var i = 0; i < destination.contact.length; i++){
        if(destination.contact[i].number == number){
          destination.contact[i].permission = true;
          destination.markModified('contact');
          destination.save();
          console.log("confirmed number " + number);
        }
      }
  });
}

DestinationModel.prototype.endDestination = function(){
  Destination.find({}).remove().exec();
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