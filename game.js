var deck = [];
var worlds = [];
var normalWorld;
var world1;
var world2;
var WFDirection = 1; //+1 shift left, -1 shift right
var player;
var table;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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

  const PlayerStates = 
  { PLAYING: 0,        //not needed
    CARD_SELECT: 1,       
    SLOT_SELECT: 2,       
    WAITING:3
  }

class Slot{ 
    constructor(X,Y){
        this.coords = new Array(2);
        this.coords[0] = X;
        this.coords[1] = Y;
        this.WI;
        this.env;
        this.content;
      }
    }
 
class Card {
    constructor() {
    }
    play(curPlayer){}
  }

class FlipCard extends Card{    //applies to environment
    constructor(figure)
    {   super();
        this.figure = figure;
        //this.affectedCoords = new Array(Figures.figure.length);
        this.affectedCoords = JSON.parse(JSON.stringify(figure)); 
    }
    
    play(curPlayer)
    {   
        curPlayer.state = PlayerStates.SLOT_SELECT;//allow for slot selection
        updateInstructions("Select a slot to place the card");
        console.log("playing flip card, after update");
        //while(!curPlayer.selectedSlotCoords[1]){}  //wait until the last one is selected
       // for(let i = 0; i<affectedCoords.length;i++)
       // {
       //     table.flipAll(centerCoordX+affectedCoords[i][0],enterCoordY+affectedCoords[i][1]);
        //}
    }
}
class StatusCard extends Card{    //applies to items/creatures

    play(curPlayer){
        curPlayer.state = PlayerStates.SLOT_SELECT;//allow for slot selection
        updateInstructions("Select a slot");
        while(!curPlayer.selectedSlotCoords[1]){}  //wait until the last one is selected
    }
}

class SpecialCard extends Card{ //changes rules of the game
    constructor(dir)                                        //is constructor inherited?
    {   super();
        this.direction = dir;}

    play(){
        if((WFDirection!=this.direction)&&(this.direction!=null))
        {WFDirection=this.direction;}
    }
}

class World{
    constructor(WI)
    {
        this.WI = WI;                               
        this.env = new Array(tableRows);             //for now just color
        this.creatures = new Array(tableRows);       //2 3d matrixes - [x] [y] [creature] 
        this.generateCreaturesRand();
        this.fillEnv();
    }

    generateCreaturesRand()
    { 
        for (let i = 0; i < tableRows; i++) {
            this.creatures[i] = new Array(tableColumns); // make each element an array
            for(let j = 0; j< tableColumns; j++)
            {
                if(getRandomInt(10)%3==0)//kinda randomly populate
                {
                    this.creatures[i][j] = 'someCreature from World '+ this.WI + ' at ' + i + ',' + j; 
                } 
            }
        }
    }

    fillEnv()
    { 
        for (let i = 0; i < tableRows; i++) {
            this.env[i] = new Array(tableColumns); // make each element an array
            for(let j = 0; j< tableColumns; j++)
            {
                let colorKey = this.WI;
                this.env[i][j] = Colors[colorKey];
                //console.log("setting env "+ this.env[i][j] + " for slot "+  i+","+j);
            }
        }
    }
}

table = 
{ slots : new Array(tableRows),

 initialize(){
    for(let i = 0; i<tableRows;i++)
    {
        this.slots[i] = new Array(tableColumns); // make each element an array
        for(let j = 0; j< tableColumns; j++)
        {
            this.slots[i][j] = new Slot(i,j); 
            let WIRandom = getRandomInt(3);
            this.slots[i][j].env = worlds[WIRandom].env[i][j];
            //console.log("setting env "+ this.slots[i][j].env + " for slot "+  i+","+j);
            this.slots[i][j].content = worlds[WIRandom].creatures[i][j];
        }
    }
 },
 flipAll(coordX, coordY)
    {
        let currentWI = slots[coordX][coordY].WI;
        let wcount = worlds.length;
        newWI = (wcount+currentWI+WFDirection)%wcount;
        this.slots[coordX][coordY].WI = newWI;
        this.slots[coordX][coordY].env = worlds[newWI].env[coordX][coordY];
        this.slots[coordX][coordY].content = worlds[newWI].creatures[coordX][coordY];
    }
};

class Player
{   
    constructor()
    {this.health = 100;
     this.hand = new Array(handCount);
    this.selectedCardIndex = null;
    this.selectedSlotCoords = new Array(2);
    this.state = PlayerStates.CARD_SELECT;
    }
    dealCards()
    {
        for(let i=0;i<handCount;i++)
        {this.hand[i] = deck.pop();}
        updateRender();
    }
    selectCard(index)
    {
        if(this.state==PlayerStates.CARD_SELECT)
        {  this.selectedCardIndex = index;
            console.log("selected card: " + this.hand[this.selectedCardIndex]);
           // this.state=PlayerStates.PLAYING;
        }
        else{alert("Cannot select a card yet!");}
        
    }
    selectSlot(X,Y)
    {
        if(this.state==PlayerStates.SLOT_SELECT){
            this.selectedSlotCoords[0] = X;
            this.selectedSlotCoords[1] = Y;
        }
        
    }
    playTurn()
    {
        //if((this.state==PlayerStates.PLAYING)&&(selectedCardIndex!=null))
        if(this.selectedCardIndex!=null)
        {
            console.log("card: " + this.hand[this.selectedCardIndex]);
            this.hand[this.selectedCardIndex].play(this);
            this.hand.splice(this.selectedCardIndex);
            this.selectedCardIndex = null;
            this.selectedSlotCoords = null;
            updateRender();
            this.state = PlayerStates.CARD_SELECT;//change to wait later!
        }
        else{alert("Not your turn yet! Also a card has to be selected");}
    }
};

function initGame() {
     normalWorld = new World(0);
     world1 = new World(1);
     world2 = new World(2);
    worlds.push(normalWorld,world1,world2);
    player = new Player();
    table.initialize();
    initializeDeck();
    console.log(player);
    player.dealCards();
    updateRender();
}

function initializeDeck() {
card0 = new FlipCard(Figures.CORNER_UPPER_LEFT);
card1 = new FlipCard(Figures.CORNER_UPPER_RIGHT);
card2 = new FlipCard(Figures.CORNER_LOWER_LEFT);
card3 = new FlipCard(Figures.CORNER_LOWER_RIGHT);

card4 = new FlipCard(Figures.CROSS);

card5 = new FlipCard(Figures.SIDE_LEFT);
card6 = new FlipCard(Figures.SIDE_RIGHT);
card7 = new FlipCard(Figures.SIDE_UPPER);
card8 = new FlipCard(Figures.SIDE_LOWER);

card9 = new SpecialCard(1);
card10 = new SpecialCard(1);
card11 = new SpecialCard(-1);
card12 = new SpecialCard(-1);

deck.push(card0,card1,card2,card3,card4,card5,card6,card7,card8,card9,card10,card11,card12);
shuffleArray(deck);
}


function updateDeckCount() {
   document.getElementById("deckCount").innerHTML = "Cards in Deck: ".concat(deck.length.toString());
    }

 function updateInstructions(text)
{
     document.getElementById("infoText").innerHTML = "Info: ".concat(text);
}

function updateRender()
{
    for(let i = 0;i<tableRows;i++){
        for(let j=0;j<tableColumns;j++){
            document.getElementById("tcell"+i+j).style.background = table.slots[i][j].env;
            //console.log("setting color "+ table.slots[i][j].env + " for slot "+  i+","+j);
        }
    }
    
    updateDeckCount();
}
  //helper functions:
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    

}