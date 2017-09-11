var inquirer = require("inquirer");
var library = require("./cardLibrary.json");
var BasicCards = require("./BasicCards.js");
var clozeCards = require("./ClozeCards.js");
var fs = require("fs");

var takeCard;
var usedCard;
var count = 0;

function displayMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "\nPlease choose an option from the list below",
            choices: ["Create", "Play All", "Shuffle", "Show All", "Exit"],
            name: "gameOptions"
        }
    ]).then(function (answer) {
        var gameMessage;

        switch (answer.gameOptions) {
            case 'Create':
                console.log("Create a new flashcard");
                gameMessage = setTimeout(createCard, 1000);
                break;
            
            case 'Play All':
                console.log("Lets play all the cards");
                gameMessage = setTimeout(playAllCards, 1000);
                break;
            case 'Shuffle':
                console.log("lets mix it up");
                gameMessage = setTimeout(shuffleCards, 1000);
                break;
            case 'Show All':
                console.log("I will show all the cards onto the screen");
                gameMessage = setTimeout(showCards, 1000);
                break;
            default:
                console.log("");
                console.log("Que?");
                console.log("");
        }
    });
}

displayMenu();

function createCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "flashcard type?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }
    ]).then(function (appData) {

        var cardType = appData.cardType;
        console.log(cardType);

        if (cardType = "Basic Card") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please fill out the front of the card",
                    name: "front"
                },
                {
                    type: "input",
                    message: "Please fill out the back of the card",
                    name: "back"
                }
            ]).then(function (cardData) {
                var cardObj = {
                    type: "cards",
                    front: cardData.front,
                    back: cardData.back
                };
                library.push(cardObj);
                fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2)); //json
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Another Card?",
                        choices: ["yes", "no"],
                        name: "anotherCard"
                    }

                ]).then(function (appData) {
                    if(appData.anotherCard === "yes") {
                      
                        createCard();
                    } else {
                        setTimeout(openMenu, 1000);
                    }
                });
            });

} else {inquirer.prompt([
    {
        type: "input",
        message: "Please type out your full message",
        name: "text"
    },
    {
        type: "input",
        message: "type the portion of the text you want clozed with ....",
        name: "cloze"
    }

]).then(function(cardData) {
    var cardObj = {
        type: "ClozeCard",
        text: cardData.text,
        cloze: cardData.cloze

    };
    if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
        library.push(cardObj);
        fs.writeFile("cardLibrary.json"), JSON.stringify(library, null, 2);
    } else {
        console.log("Sorry, the cloze must match the text");

    } inquirer.prompt([
        {
            type: "list",
            message: "Another Card?",
            choices: ["yes", "no"],
            name: "anotherCard"
        }
    ]).then(function (appData) {
        if(appData.anotherCard === "yes") {
            createCard();
        } else {
            setTimeout(openMenu, 1000);
        }
    });
}); 
}
});
};
         
function askQuestion(card) {
    if (card.type === "BasicCard") {
        drawnCard = new BasicCard(card.front, card.back);
        return drawnCard.front;    
    } else if (card.type === "ClozeCard") {
        drawnCard = new clozeCards(card.text, card.cloze)
        return drawnCard.clozeRemoved();
    }
};

function askQuestion() {
    if (count < library.length) {
        playedCard = getQuestion(library[count]);
        inquirer.prompt([
            {
            type: "input",
            message: playedCard,
            name: "question"
            }
        ]).then(function(answer) {
            if (answer.question === library[count].back || answer.question === library[count].cloze) {
                console.log(colors.green("You are correct"));

            } else {
                if (drawnCard.front !== undefined) {
                    console.log(colors.red("Sorry the correct answer was ") + library[count].back);

                } else {
                    console.log(colors.red("Sorry the correct answer was ") + library[count].cloze);

                
                count++;
                askQuestion();
            } 
            count = 0;
            openMenu();
        }
    } )
function shuffleDeck() {
    newDeck = library.slice(0);
    for (var i = library.length - 1; i > 0; i--) {
        var getIndex = Math.floor(Math.random() * (i + 1));
        var shuffle = newDeck[getIndex];

        newDeck[getIndex] = newDeck[i];
        newDeck[i] = shuffle;
    }
    fs.writeFile("cardLibrary.json", JSON.stringify(newDeck, null, 2));
    console.log(colors.cyan("the deck of flashcards is shuffled"));
}

function randomCard() {
    var randomNumber = Math.floor(Math.random()* (library.length - 1));
    playCard = getQuestion(library[randomNumber]);
        inquirer.prompt([
            {
                type: "input",
                message: playCard,
                name: "question"
            }
        ]).then(function (answer){
            if (answer.question === library[randomNumber].back || answer.question === library[randomNumber].cloze) {
                console.log(colors.green("Correct!"));
                setTimeout(openMenu, 1000);
            } else {
                if (drawnCard.front !== undefined) {
                    console.log(colors.red("Sorry, the correct answer was ") + library[randomNumber].back);
                    setTimeout(openMenu, 1000);
                } else {
                    console.log(colors.red("Sorry, the correct answer was ") + library[randomNumber].cloze);
                    setTimeout(openMenu, 1000);
                }
            }
        });
};

function showCards () {
    var library = require("./cardLibrary.json");
    if (count < library.length) {
        if (library[count].front !== undefined) {
            console.log("");
            console.log(colors.yellow("Basic Card"));
            console.log(colors.yellow("+"));
            console.log("Front: " + library[count].front);
            console.log("-");
            console.log("Back: " + library[count].back);
            console.log(colors.yellow("++"));
            console.log("");

        }

        count++;
        showCards();

    } else {
        count=0;
        openMenu();
    }}}}
