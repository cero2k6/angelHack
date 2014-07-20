var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var stateSchema = Schema({
  date : Date,
  state : String,

})

var State = mongoose.model("stateLog", stateSchema);

stateModel = function(){};

stateModel.prototype.addState = function(item, callback){

  var state = new State({state : item.state, date :  new Date()});

  state.save(function(err){
      console.log("ADDING state IN MODEL", err);
  });
}


stateModel.prototype.Remove = function(callback){
  State.find({}).remove().exec();
}

stateModel.prototype.GetStates = function(callback){
  State.find({}, function(err, states){
      callback(states);
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

exports.stateModel = stateModel;