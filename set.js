var deck = [];
var hand = [];
var selected;


function startGame() {
    //initializeDeck();
    //dealCards();
    //updateDeckCount();

}

function updateDeckCount() {
    document.getElementById("deckCount").innerHTML = 
        "Cards in Deck: ".concat(deck.length.toString());
}