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

const Figures = {                                                           //corners: UL     UR     LL       LR
    CORNER_UPPER_LEFT:  [[0,0],[0,1],[1,0]],  CORNER_UPPER_LEFT_I: "r",     //         ▣ □    □ ▣    □        □             00 01 02 03 04
    CORNER_UPPER_RIGHT: [[0,-1],[0,0],[1,0]], CORNER_UPPER_RIGHT_I:"--,",   //         □         □    ▣ □   □ ▣             10 11 12 13 14
    CORNER_LOWER_LEFT:  [[-1,0],[0,0],[0,1]], CORNER_LOWER_LEFT_I: "|_",    //cross:                                         20 21 32 33 44
    CORNER_LOWER_RIGHT: [[-1,0],[0,-1],[0,0]],CORNER_LOWER_RIGHT_I:"_|",    //                   □                           30 31 32 33 34
    CROSS: [[-1,0],[0,-1],[0,0],[0,1],[1,0]],    CROSS_I:"-|-",             //                 □ ▣ □                        40 41 42 43 44
    SIDE_LEFT: [[-1,0],[0,-1],[0,0],[1,0]],   SIDE_LEFT_I:"-|",             //                   □
    SIDE_RIGHT: [[-1,0],[0,0],[0,1],[-1,0]],  SIDE_RIGHT_I:"|-",            //sides:   L     R        U        L
    SIDE_UPPER: [[0,-1],[0,0],[0,1],[-1,0]],  SIDE_UPPER_I:"T",             //         □     □          
    SIDE_LOWER: [[-1,0],[0,-1],[0,0],[0,1]],  SIDE_LOWER_I:"_|_"            //       □ ▣    ▣ □    □ ▣ □      □
  };                                                                        //         □     □        □      □ ▣ □ 

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
    activate(curPlayer){}
    play(curPlayer){}
  }

class FlipCard extends Card{    //applies to environment
    constructor(figure,figureIcon)
    {   super();
        this.symbol = figureIcon;
        //console.log("added symbol: "+ this.symbol);
        this.affectedCoords = JSON.parse(JSON.stringify(figure)); 
    }
    activate(curPlayer)
    {
        curPlayer.state = PlayerStates.SLOT_SELECT;//allow for slot selection
        updateInstructions("Select a slot to place the card");
        
    }
    play(curPlayer)
    {   
        if(curPlayer.selectedSlotCoords != null){  //wait until the last one is selected
            let centerCoordX = curPlayer.selectedSlotCoords[0];
            let centerCoordY = curPlayer.selectedSlotCoords[1];
            //console.log(this.affectedCoords);
       for(let i = 0; i<this.affectedCoords.length;i++)
       {
            table.flipAll(centerCoordX+this.affectedCoords[i][0],centerCoordY+this.affectedCoords[i][1]);
        }
        updateInstructions(" ");
        updateRender(curPlayer);
        console.log("playing flip card, after update");
    }
    }
}
class StatusCard extends Card{    //applies to items/creatures

    activate(curPlayer){
    curPlayer.state = PlayerStates.SLOT_SELECT;//allow for slot selection
    updateInstructions("Select a slot");}

    play(curPlayer){
        
    }
}

class SpecialCard extends Card{ //changes rules of the game
    constructor(dir,symbol)                                        //is constructor inherited?
    {   super();
        this.direction = dir;
        this.symbol = symbol;
        console.log("added symbol: "+ this.symbol);}

    activate(curPlayer){
        updateInstructions("You can use the special card.");}

    play(curPlayer){
        WFDirection=this.direction;
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
            this.slots[i][j].WI = WIRandom;
            this.slots[i][j].env = worlds[WIRandom].env[i][j];
            //console.log("setting env "+ this.slots[i][j].env + " for slot "+  i+","+j);
            this.slots[i][j].content = worlds[WIRandom].creatures[i][j];
        }
    }
 },
 flipAll(coordX, coordY)
    {
        let currentWI = this.slots[coordX][coordY].WI;
        let wcount = worlds.length;
        let newWI = (wcount+currentWI+WFDirection)%wcount;
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
    this.selectedCardIndex;
    this.selectedSlotCoords = new Array(2);
    this.state = PlayerStates.CARD_SELECT;
    }
    dealCards()
    {
        for(let i=0;i<handCount;i++)
        {this.hand[i] = deck.pop();}
        updateRender(this);
    }
    drawCardsToFull()
    {
        let cardsToDraw = handCount - this.hand.length;
        for(let i=0;i<cardsToDraw;i++)
        {this.hand[i] = deck.pop();}
        updateRender(this);
    }
    drawCards(cardsToDraw)
    {
        for(let i=0;i<cardsToDraw;i++)
        {this.hand[i] = deck.pop();}
        updateRender(this);
    }
    selectCard(index)
    {
        if(this.state==PlayerStates.CARD_SELECT)
        {  this.selectedCardIndex = index;
            console.log("selected card: " + this.hand[this.selectedCardIndex]);
            this.hand[this.selectedCardIndex].activate(this);
        }
        else{alert("Cannot select a card yet!");}
        updateRender(this);
    }
    selectSlot(X,Y)
    {
        if(this.state==PlayerStates.SLOT_SELECT){
            this.selectedSlotCoords[0] = X;
            this.selectedSlotCoords[1] = Y;
        }
        updateRender(this);
    }
    playTurn()
    {
        //if((this.state==PlayerStates.PLAYING)&&(selectedCardIndex!=null))
        if(this.selectedCardIndex!=undefined)        //add check!
        {
            console.log("card: " + this.hand[this.selectedCardIndex]);
            this.hand[this.selectedCardIndex].play(this);
           // this.hand.splice(this.selectedCardIndex);
            this.state = PlayerStates.CARD_SELECT;//change to wait later!
            console.log("Turn End");
            updateRender(this);
        }
        else{alert("Not your turn yet! Also a card has to be selected");}
    }
};

function initGame() {
   
     normalWorld = new World(0);
     world1 = new World(1);
     world2 = new World(2);
     worlds = [];
    worlds.push(normalWorld,world1,world2);
    player = new Player();
    table.initialize();
    initializeDeck();
    console.log(player);
    player.dealCards();
    updateRender();
}

function initializeDeck() {
card0 = new FlipCard(Figures.CORNER_UPPER_LEFT, Figures.CORNER_UPPER_LEFT_I);
card1 = new FlipCard(Figures.CORNER_UPPER_RIGHT,Figures.CORNER_UPPER_RIGHT_I);
card2 = new FlipCard(Figures.CORNER_LOWER_LEFT,Figures.CORNER_LOWER_LEFT_I);
card3 = new FlipCard(Figures.CORNER_LOWER_RIGHT,Figures.CORNER_LOWER_RIGHT_I);

card4 = new FlipCard(Figures.CROSS,Figures.CROSS_I);

card5 = new FlipCard(Figures.SIDE_LEFT,Figures.SIDE_LEFT_I);
card6 = new FlipCard(Figures.SIDE_RIGHT,Figures.SIDE_RIGHT_I);
card7 = new FlipCard(Figures.SIDE_UPPER,Figures.SIDE_UPPER_I);
card8 = new FlipCard(Figures.SIDE_LOWER,Figures.SIDE_LOWER_I);

card9 = new SpecialCard(1, 1);
card10 = new SpecialCard(1,+1);
card11 = new SpecialCard(-1,-1);
card12 = new SpecialCard(-1,-1);

deck = [];
deck.push(card0,card1,card2,card3,card4,card5,card6,card7,card8,card9,card10,card11,card12);


deck.forEach(card => { card.symbol += "\n" + card.constructor.name;});

shuffleArray(deck);
}


function updateDeckCount() {
   document.getElementById("deckCount").innerHTML = "Cards in Deck: ".concat(deck.length.toString());
    }

 function updateInstructions(text)
{
     document.getElementById("infoText").innerHTML = "Info: ".concat(text);
}
function updateDirection()
{
    let direcionInfo = "";
    switch (WFDirection)
    {   case 1:
        for(let i=0;i<worlds.length;i++){
        direcionInfo += Colors[i]+" "; }
        break;

        case -1:
        for(let i=worlds.length-1;i>=0;i--){
        direcionInfo += Colors[i]+" ";}
        break;
    }
     document.getElementById("direction").innerHTML = " World Flip Direction: ".concat(WFDirection + ": " + direcionInfo);
}
function drawOutlineByTag(tag)
{
     document.getElementById(tag).classList.add( "selected");
}
function removeOutlineByTag(tag)
{
     document.getElementById(tag).classList.remove( "selected");
}
function updateRender(curPlayer)
{   

    for(let i = 0;i<tableRows;i++){
        for(let j=0;j<tableColumns;j++){
            document.getElementById("tcell"+i+j).style.background = table.slots[i][j].env;
            if((curPlayer.selectedSlotCoords[0]==i)&&(curPlayer.selectedSlotCoords[1]==j))//update slot selection:
            {
                drawOutlineByTag("tcell"+i+j);
            }
            else{removeOutlineByTag("tcell"+i+j);}
        }
    }

    for(i = 0;i<curPlayer.hand.length;i++){
        
            document.getElementById("hcell"+i).innerHTML  = curPlayer.hand[i].symbol;
        
            if(curPlayer.hand[i]==null){
                document.getElementById("hcell"+i).innerHTML  = "NaN";
            }

            if(i==curPlayer.selectedCardIndex) //update card selection:
            {
                drawOutlineByTag("hcell"+i);
            }else{removeOutlineByTag("hcell"+i);}
        }
    
    switch (curPlayer.state) {
        case PlayerStates.CARD_SELECT: 
            updateInstructions("Select a card");
            break;
        case PlayerStates.SLOT_SELECT: 
            updateInstructions("Select a slot");
            break;
        case PlayerStates.PLAYING:
            updateInstructions("Playing your turn");
            break;
        case PlayerStates.WAITING:
            updateInstructions("Waiting for your turn");
            break;
    }
        

    updateDeckCount();
    updateDirection();
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

function DebugLog() {
    
    console.log(player);
}