var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js"); 

var library = require("./cardLibrary.json");

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
			choices: ["Create", "Use All", "Random", "Shuffle", "Show All", "Exit", "Delete All (WARNING)"],
			name: "menuOptions"
		}
	]).then(function(answer){
		var waitMsg;

		switch (answer.menuOptions) {
			case 'Create':
				console.log("Let's make a new flashcard...");
				waitMsg = setTimeout(createCard, 1000); // createCard function will run after 1 seconds
				break;

			case 'Use All':
				console.log("Let's run through the deck");
				waitMsg = setTimeout(askQuestions, 1000); // UseAll function will run after 1 seconds
				break;

			case 'Random':
				console.log("Let's pick a random card from the deck"); // Random function will run after 1 seconds
				waitMsg = setTimeout(randomCard, 1000);
				break;

			case 'Shuffle':
				console.log("Let's shuffle through all the cards in the deck..."); // Shuffle function will run after 1 seconds
				waitMsg = setTimeout(shuffleDeck, 1000);
				break;

			case 'Show All':
				console.log("Printing all the cards in the deck to the screen"); // ShowAll function will run after 1 seconds
				waitMsg = setTimeout(showCards, 1000);
				break;

			case 'Exit':
				console.log("Thank you for using the flashcard-generator"); 
				process.exit();
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

// If the user choses to Create a card, this will run
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
			fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2), (err) => {
				if (err) throw err;
			});	

			// write the updated array to the cardLibrary	})
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
			fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2), (err) => {
				if (err) throw err;
			});
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
};

// function to ask question from the stored cards in the library
function askQuestions() {
	if (count < library.length) { // if current count (while starting at 0) is less than the number of cards in the library...
		playedCard = getQuestion(library[count]); // playedCard stores the question from the card with index equal to the current counter
		inquirer.prompt([	// inquirer used to ask the question from the playedCard
			{
				type: "input",
				message: playedCard,
				name: "question"
			}
		]).then(function(answer) { // once the user answers
			// If the users answer equals .back or .cloze of the playedCard run a message "You are correct"
			if (answer.question === library[count].back || answer.question === library[count].cloze) {
				console.log("You are correct!");
			} else {
				// Checks to see if current card if Cloze or Basic
				if (drawnCard.front !== undefined) { // if card has a front then it is a Basic card
					console.log("Sorry, the correct answer was " + library[count].back + "."); // Grabs and shows correct answer from cardLibrary
				} else { // otherwise it is a Cloze card
					console.log("Sorry, the correct answer was " + library[count].cloze + "."); // Grabs and shows correct answer from cardLibrary
				}
			}

			count++;	// Increase the counter for the next run through
			askQuestions(); // Recursion, call the function within the function to keep it running. It will stop when counter = library.length
		});
	} else {
		count = 0;	// Reset counter to 0 once loop ends
		openMenu(); // Call the menu for the user to continue using the app
	}
};

function shuffleDeck() {
	newDeck = library.slice(0); // Copy the flashcards into a new array
	for (var i = library.length - 1; i > 0; i--) { // Fisher-Yates shuffle should jumble up order of copied array

		var getIndex = Math.floor(Math.random() * (i +1));
		var shuffled = newDeck[getIndex];

		newDeck[getIndex] = newDeck[i];

		newDeck[i] = shuffled;
	}

	fs.writeFile("cardLibrary.json", JSON.stringify(newDeck, null, 2), (err) => {
		if (err) throw err;
	}); 
	// Write the new randomized array over the old one
	console.log("The deck of flashcards have been shuffled");
	openMenu();
}

// function to ask question from a random card
function randomCard() {
	var randomNumber = Math.floor(Math.random() * (library.length -1)); // Get a random index number within the length of the current library

	playedCard = getQuestion(library[randomNumber]);	//playedCard stores the question from the card with index equal to the randomNumber
		inquirer.prompt([
			{
				type: "input",
				message: playedCard,
				name: "question"
			}
		]).then(function(answer) {
			// If the user answers equals .back or .cloze of the playedCard run a message
			if (answer.question === library[randomNumber].back || answer.question === library[randomNumber].cloze) {
				console.log("You are correct!");
				setTimeout(openMenu, 1000);
			} else {
				// Check to see if random card if Cloze or Basic
				if (drawnCard.front !== undefined) { // If card has a front then it is a basic card
				console.log("Sorry, the correct answer was " + library[randomNumber].back + "."); // Grabs and shows correct answer from cardLibrary
				setTimeout(openMenu, 1000);
				} else { // otherwise it is a cloze card
					console.log("Sorry, the correct answer was " + library[randomNumber].cloze + "."); // Grabs and shows correct answer from cardLibrary
					setTimeout(openMenu, 1000);
				}
			}
		});
};

//function to print all cards on screen for user to read through
function showCards(){

	var library = require("./cardLibrary.json");

	if (count < library.length) { // if counter stays below the length of the library array

		if(library[count].front !== undefined) { // if card has a front, then it is a basicCard
			console.log("");
	        console.log("++++++++++++++++++ Basic Card ++++++++++++++++++");
	        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
	        console.log("Front: " + library[count].front); //grabs & shows card question
	        console.log("------------------------------------------------");
	        console.log("Back: " + library[count].back + "."); //grabs & shows card question
	        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
	        console.log("");
		} else { // otherwise it is a Cloze card
	        console.log("");
	        console.log("++++++++++++++++++ Cloze Card ++++++++++++++++++");
	        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
	        console.log("Text: " + library[count].text); //grabs & shows card question
	        console.log("------------------------------------------------");
	        console.log("Cloze: " + library[count].cloze + "."); //grabs & shows card question
	        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
	        console.log("");

		}

		count++; // increase the counter each round
		showCards(); // re-call the function with in itself. recursion
	} else {
		count = 0; // reset counter to 0 once loop ends
		openMenu(); // call the menu for the user to contiue using the app
	}

}