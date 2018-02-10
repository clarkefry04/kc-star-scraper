var mongoose = require("mongoose");

//saving a reference to the Schema constructor
var Schema = mongoose.Schema;

//using the schema constructor, creaating a new NoteSchema object
//this is similar to a sequelize model
var NoteSchema = new Schema({
	//title is of type string
	title: String,
	//body is of type string
	body: String
});

//Creates our model from teh above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

//exports the note model
module.exports = Note;