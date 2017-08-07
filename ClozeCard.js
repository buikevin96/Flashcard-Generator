function ClozeCard(text, cloze){

	this.text = text.split(cloze), // Whatever is in the first param, replace with second param
	this.cloze = cloze // Contains only the deleted portion of the text

};

// Constructor that creates a prototype of ClozeCard to return the question missing cloze
function ClozeCardPrototype() {

	this.clozeRemoved = function() {
		return `${this.text[0]} ... ${this.text[1]}`;
	};
};

ClozeCard.prototype = new ClozeCardPrototype();



module.exports = ClozeCard; // Allows this file to be called by other files