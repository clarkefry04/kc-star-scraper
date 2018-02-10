//Grab the articles as a json
$.getJSON("/articles", function(data) {
	//for each one
	for (var i = 0; i < data.length; i++) {

		if(data[i].link !== "undefined" && data[i].title !==""){
		//display the apropos information on the page
		$("#articles").prepend("<div class='panel panel-default'> <div class='panel-heading'> <h3 data-id='" + data[i]._id + "'>" + data[i].title + "</h3> </div> <div class='panel-body'> <p> <a href='" + data[i].link + "' target = '_blank'>" + data[i].summary + " </p></a> </div> </div>");
		}
	}
});

//whenever someone clicks an h3 tag
$(document).on("click", "h3", function() {

	//empty the notes from the note section
	$("#notes").empty();
	//save the id from the p tag
	var thisId = $(this).attr("data-id");

	//now make an ajax call for the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	//now we add the note information to the page
	.done(function(data) {
		console.log(data);
		//the title of the article
		$("#notes").append("<h2>" + data.title + "<h2>");
		//an input to enter a new title
		$("#notes").append("<input id='titleinput' name='title' >");
		//a textarea to add a new note body
		$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
		//a button to submit a new note, with the id of the article saved to it
		$("#notes").append("<button data-id'" + data._id + "' id='savenote'>Save Note</button>");

		//if there's a note in the article
		if(data.note) {
			//place the title of the note in the title input
			$("#titleinput").val(data.note.title);
			//place the body of the note in the body textarea
			$("#bodyinput").val(data.note.body);
		}
	});
});

//when you click the save note button
$(document).on("click", "#savenote", function() {
	//grab the id asssocated with the article from the submit button
	var thisId = $(this).attr("data-id");

	//run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			//value taken from the title input
			title: $("#titleinput").val(),
			//value taken from the note textarea
			body: $("#bodyinput").val()
		}
	})
	.done(function(data) {
		//console response
		console.log(data);
		//empty the notes section
		$("#notes").empty();
	});

	//we also need to remove the values entered in teh input and text area for not entry
	$("#titleinput").val("");
	$("#bodyinput").val("");
});