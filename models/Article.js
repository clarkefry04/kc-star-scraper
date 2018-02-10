var mongoose = require("mongoose");

//saving a refernce to the schema constructor
var Schema = mongoose.Schema;

//Using the schema constructor, we create a new UserSchema object
var ArticleSchema = new Schema({
	//title is required and of type string
	title: {
		type: String,
		required: false
	},
	//summary is required and is a type of string
	summary: {
		type: String,
		required: false
	},
	//link is required and of type String
	link: {
		type: String,
		required: false
	},
	//note is an object that stores a Note id
	//the ref property links the ObjectId to the Note model
	//this allows us to populate the Article with an associated note
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

//this creates our model from teh above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

//exporting the Article model
module.exports = Article;