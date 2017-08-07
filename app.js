var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js"); 

var library = require("./cardLibrary.json")

var inquirer = require('inquirer'); // Initialized NPM Inquirer Package
var fs = require("fs");

var drawnCard;
var playedCard;
var count = 0;

function openMenu() {
	inquirer.prompt([
		{
			type: "list",
			message: "\nChoose a menu option from the list below", // message shown to user
			choices: ["Create", "Use All", "Random", "Shuffle", "Show All", "Exit"],
			name: menuOptions
		}
	]).then(function(answer){
		var waitMsg;

		switch (answer.menuOptions) {
			case 'Create':
				console.log("Let's make a new flashcard...");
				waitMsg = setTimeout(createCard, 1000);
				break;

			case 'Use All':
				console.log("Let's run through the deck");
				waitMsg = setTimeout(askQuestions, 1000);
				break;

			case 'Random':
				console.log("Let's pick a random card from the deck");
				waitMsg = setTimeout(shuffeDeck, 1000);
				break;

			case 'Shuffle':
				console.log("Let's shuffle through all the cards in the deck...");
				waitMsg = setTimeout(shuffleDeck, 1000);
				break;

			case 'Show All':
				console.log("Printing all the cards in the deck to the screen");
				waitMsg = setTimeout(showCards, 1000);
				break;

			case 'Exit':
				console.log("Thank you for using the flashcard-generator");
				return;
				break;

			default: 
				console.log("");
				console.log("Sorry I don't understand");
				console.log("");
		}
	});
}

openMenu(); // Calls the openMenu function to run

function createCard() {

	inquirer.prompt([
		{
		type: "list",
		name: "flashcard",
		message: "What type of flashcard would you like to create?",
		choices: ["BasicCard", "ClozeCard"]
		}	
	]).then(function(appData){
		var cardType = appData.flashcard;
		console.log(cardType)

		if (cardType === "BasicCard") {
			inquirer.prompt([
			{
				type: "input",
				message: "Please fill out the front of your card with your question.",
				name: "front"
			},
			{
				type: "input",
				message: "Please fill out the back of your card with the answer.",
				name: "back"
			}
		]).then(function(cardData){
			
			// create card object with Basic card data for its front and back
			var cardObj = {
				type: "BasicCard",
				front: cardData.front,
				back: cardData.back
			};

			library.push(cardObj); // Push card Object into library
			fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));	// write the updated array to the cardLibrary	})

			inquirer.prompt([
				{
					type: "list",
					message: "Would you like to make another card?",
					choices: ["Yes", "No"],
					name: "anotherCard"
				}
			]).then(function(appData) {
				if (appData.anotherCard === "Yes") {
					createCard();
				} else {
					setTimeout(openMenu, 1000); // Reopen main menu to the user
				}
			});
		});
	} else {
		inquirer.prompt([
		{
			type: "input",
			message: "Please type out the full text of your statement (remove cloze in next step).",
			name: "text"
		},

		{
			type: "input",
			message: "Please type the portion of text you want to cloze, replacing it with '...'.",
			name: "cloze"
		}

	]).then(function(cardData){

		// Retrievs data from above (placed into cardData), and specifices with .()
		var cardObj = {
			type: "ClozeCard",
			text: cardData.text,
			cloze: cardData.cloze
		};
		if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
			library.push(cardObj); // Pushes cardObj into library
			fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));
		} else {
			console.log("Sorry, the cloze must math some word(s) in the text of your statement.");
		}

		inquirer.prompt([
		{
			type: "list",
			message: "Would you like to make another card?",
			choices: ["Yes", "No"],
			name: "anotherCard"
		}

	]).then(function(appData) {

			// If the option the user chooses is yes
			if (appData.anotherCard === "Yes") {
				// Run this function
				createCard();
			} else {
				setTimeout(openMenu, 1000); // Return user to main menu
			}
		});
	});

		}
	});
}; // end of function createCard()

function getQuestion(card) {
	if (card.type === "BasicCard") {	// If the card.type is a BasicCard
		drawnCard = new BasicCard(card.front, card.back);
		return drawnCard.front;
	} else if (card.type === "ClozeCard") {
		drawnCard = new ClozeCard(card.text, card.cloze);
		return drawnCard.clozeRemoved();
	}
}