var table;
var deck = [];
var hand = [];
var worlds = [];
var selectedCard;
var currentWI; //+1 shift left, -1 shift right

table = 
{ 


}


function startGame() {
    initializeDeck();
    //dealCards();
    //updateDeckCount();

}

function initializeDeck() {

}


function updateDeckCount() {
    document.getElementById("deckCount").innerHTML = 
        "Cards in Deck: ".concat(deck.length.toString());
}

function selectSlot()
{

}

function selectCard()
{
    
}

class Card {
    constructor() {
        this.coords = new Array(2);
    }
    play(){}
  }

  class Slot{ 
    constructor(){
        this.coords = new Array(2);
        this.world;
        this.content;
      }
    }
 

class FlipCard extends Card{    //applies to environment
    constructor(figure)
    {
        this.affectedCoords[];
    }
    
    play(coordX, coordY){}
}
class StatusCard extends Card{    //applies to items/creatures

    play(coordX, coordY){}
}
class SpecialCard extends Card{ //changes rules of the game
    direction
    play(){}
}

const Figures = {                       //corners:
    CORNER_UPPER_LEFT: 'CornerUL',      //       ▣ □                 00 01 02 03 04
    CORNER_UPPER_RIGHT: 'CornerUR',     //       □    x4             10 11 12 13 14
    CORNER_LOWER_LEFT: 'CornerLL',      //cross:                      20 21 32 33 44
    CORNER_LOWER_LEFT: 'CornerLL',      //       □                    30 31 32 33 34
    CROSS: 'Cross',                     //     □ ▣ □  x1             40 41 42 43 44
    SIDE_LEFT: 'SideL',                 //       □
    SIDE_RIGHT: 'SideR',                //sides:
    SIDE_UPPER: 'SideU',                //       □
    SIDE_LOWER: 'SideL'                 //     □ ▣ □  x4
  };