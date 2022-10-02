var table;
var deck = [];
var worlds = [];
var WFDirection = 1; //+1 shift left, -1 shift right

table = 
{ slots : new Array(tableRows),

 initialize(){
    for(let i = 0; i<tableRows;i++)
    {
        slots[i] = new Array(tableColumns); // make each element an array
        for(let j = 0; j< tableColumns; j++)
        {
            slots[i][j] = new Slot(i,j); 
            let WIRandom = Math.random(0,3);
            slots[i][j].env = worlds[WIRandom].env[i][j];
            slots[i][j].content = worlds[WIRandom].creatures[i][j];
        }
    }
 },
 flipAll(coordX, coordY)
    {
        let currentWI = slots[coordX][coordY].WI;
        slots[coordX][coordY].env = worlds[currentWI+WFDirection].env[coordX][coordY];
        slots[coordX][coordY].content = worlds[currentWI+WFDirection].creatures[coordX][coordY];
    }
}

player =
{   health:100,
    hand : new Array(handCount),
    selectedCard,
    selectCard()
    {
    
    },
    selectSlot()
    {

    },
    playTurn()
    {

    }
}


function startGame() {

    var normalWorld = new World(0);
    var world1 = new World(1);
    var world2 = new World(2);
    worlds.push(normalWorld,world1,world2);
    table.initialize();
    initializeDeck();
    dealCards();
   // updateDeckCount();
}

function initializeDeck() {

}

function updateRender()
{

}

function updateDeckCount() {
    document.getElementById("deckCount").innerHTML = 
        "Cards in Deck: ".concat(deck.length.toString());
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
        this.WI;
        this.env;
        this.content;
      }
    }
 

class FlipCard extends Card{    //applies to environment
    constructor(figure)
    {
        this.figure = figure;
        //this.affectedCoords = new Array(Figures.figure.length);
        this.affectedCoords = JSON.parse(JSON.stringify(Figures.figure.value)); 
    }
    
    play(centerCoordX, enterCoordY)
    {
        for(let i = 0; i<affectedCoords.length;i++)
        {
            table.flipAll(affectedCoords[i][0],affectedCoords[i][1]);
        }
    }
}
class StatusCard extends Card{    //applies to items/creatures

    play(coordX, coordY){}
}

class SpecialCard extends Card{ //changes rules of the game
    constructor(dir)                                        //is constructor inherited?
    { this.direction = dir;}

    play(){
        if((WFDirection!=direction)&&(direction!=null))
        {WFDirection=this.direction;}
    }
}

class World{
    constructor(WI)
    {
        this.WI = WI;                               
        this.env = new Array(tableRows);             //for now just color
        this.creatures = new Array(tableRows);       //2 3d matrixes - [x] [y] [creature] 
        generateCreaturesRand();
        fillEnv();
    }

    generateCreaturesRand()
    { 
        for (let i = 0; i < tableRows; i++) {
            creatures[i] = new Array(tableColumns); // make each element an array
            for(let j = 0; j< tableColumns; j++)
            {
                if(Math.random(0,10)%3==0)
                {
                    creatures[i][j] = 'someCreature from World '+ this.WI + ' at ' + i + ',' + j; 
                } 
            }
        }
    }

    fillEnv()
    { 
        for (let i = 0; i < tableRows; i++) {
            env[i] = new Array(tableColumns); // make each element an array
            for(let j = 0; j< tableColumns; j++)
            {
                env[i][j] = Colors.WI.value;
            }
        }
    }
}

const Figures = {                                  //corners: UL     UR     LL       LR
    CORNER_UPPER_LEFT:  [[0,0],[0,1],[1,0]],       //         ▣ □    □ ▣    □        □             00 01 02 03 04
    CORNER_UPPER_RIGHT: [[0,-1],[0,0],[1,0]],      //         □         □    ▣ □   □ ▣             10 11 12 13 14
    CORNER_LOWER_LEFT:  [[-1,0],[0,0],[0,1]],      //cross:                                         20 21 32 33 44
    CORNER_LOWER_RIGHT: [[-1,0],[0,-1],[0,0]],     //                   □                           30 31 32 33 34
    CROSS: [[-1,0],[0,-1],[0,0],[0,1],[1,0]],      //                 □ ▣ □                        40 41 42 43 44
    SIDE_LEFT: [[-1,0],[0,-1],[0,0],[1,0]],        //                   □
    SIDE_RIGHT: [[-1,0],[0,0],[0,1],[-1,0]],       //sides:   L     R        U        L
    SIDE_UPPER: [[0,-1],[0,0],[0,1],[-1,0]],       //         □     □          
    SIDE_LOWER: [[-1,0],[0,-1],[0,0],[0,1]],       //       □ ▣    ▣ □    □ ▣ □     □
  };                                               //         □     □        □      □ ▣ □ 

  const Colors = 
  { 0: 'white',         //normal world
    1: 'green',         //world 2
    2: 'magenta',       //world 3
  }