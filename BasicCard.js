// Would BasicCard.js be the entry point for package.json or does it not matter? 
// Currently have this to main in package.json
var Card = require("./ClozeCard.js");

function BasicCard(front, back) {
	this.front = front, // Contain text on the front of the card
	this.back = back; // Contain text on the back of the card
}

var firstPresident = new BasicCard("Who was the first president of the United States?", "George Washington");

// "Who was the first president of the United States?"
console.log(firstPresident.front);

// "George Washington"
console.log(firstPresident.back);

// Defines a node module that exports a constructor for creating basic flashcards
module.exports = BasicCard;