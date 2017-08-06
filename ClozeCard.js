var Card = require("./BasicCard.js");

function ClozeCard(text, cloze){

	this.fullText = "",
	this.partial = partial,
	this.cloze = cloze // Contains only the deleted portion of the text

}

var firstPresidentCloze = new ClozeCard("George Washington was the first president of the United States.", "George Washington");

// "George Washington"
console.log(firstPresidentCloze.cloze);

// " ... was the first president of the United States"
console.log(firstPresidentCloze.partial);

// George Washington was the first president of the United States.
console.log(firstPresidentCloze.fullText);

// Should throw or log an error because "oops" doesn't appear in "This doesn't work"
var brokenCloze = new ClozeCard("This doesn't work", "oops");

module.exports = ClozeCard;