var deck = [];
var worlds = [];
var normalWorld;
var world1;
var world2;
var WFDirection = 1; //+1 shift left, -1 shift right
var player;
var AI;
var table;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
function inRange(num, minEx, maxEx)
{
    if((num > minEx)&&(num < maxEx)) {return true;}
    else{return false;}
}

const Shapes = {                                                           //corners: UL     UR     LL       LR
    CORNER_UPPER_LEFT:  [[0,0],[0,1],[1,0]],  CORNER_UPPER_LEFT_I: "r",     //         ▣ □    □ ▣    □        □             00 01 02 03 04
    CORNER_UPPER_RIGHT: [[0,-1],[0,0],[1,0]], CORNER_UPPER_RIGHT_I:"--,",   //         □         □    ▣ □   □ ▣             10 11 12 13 14
    CORNER_LOWER_LEFT:  [[-1,0],[0,0],[0,1]], CORNER_LOWER_LEFT_I: "|_",    //cross:                                         20 21 32 33 44
    CORNER_LOWER_RIGHT: [[-1,0],[0,-1],[0,0]],CORNER_LOWER_RIGHT_I:"_|",    //                   □                           30 31 32 33 34
    CROSS: [[-1,0],[0,-1],[0,0],[0,1],[1,0]],    CROSS_I:"-|-",             //                 □ ▣ □                        40 41 42 43 44
    SIDE_LEFT: [[-1,0],[0,-1],[0,0],[1,0]],   SIDE_LEFT_I:"-|",             //                   □
    SIDE_RIGHT: [[-1,0],[0,0],[0,1],[1,0]],  SIDE_RIGHT_I:"|-",            //sides:   L      R        U        L
    SIDE_UPPER: [[0,-1],[0,0],[0,1],[1,0]],  SIDE_UPPER_I:"T",             //         □      □          
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
        //this.coords = new Array(2);
        //this.coords[0] = X;
        //this.coords[1] = Y;
        this.coords = new THREE.Vector2(X,Y);
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
            let centerCoordX = curPlayer.selectedSlotCoords.x;
            let centerCoordY = curPlayer.selectedSlotCoords.y;
            //console.log(this.affectedCoords);
       for(let i = 0; i<this.affectedCoords.length;i++)
       {
            table.flipAll(centerCoordX+this.affectedCoords[i][0],centerCoordY+this.affectedCoords[i][1]);
        }
        updateInstructions(" ");
        updateScreen(curPlayer);
        console.log("playing flip card, after update");
    }
    }
}
class StatusCard extends Card{    //applies to items/creatures
    

    activate(curPlayer){
    curPlayer.state = PlayerStates.SLOT_SELECT;//allow for slot selection
    updateInstructions("Select a slot");
    updateScreen(curPlayer);}
    
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
        updateInstructions("You can use the special card.");
        updateScreen(curPlayer);
    }

    play(curPlayer){
        WFDirection=this.direction;
    }
}

class Creature { //changes rules of the game
    constructor(X,Y, origin, id) {
        this.health = 100;
        this.position = new THREE.Vector2(X,Y); // table coords: X down, Y to the right
        this.nativeWorldIndex= origin;
        this.paths = new Array(1);
        this.toString = "cr " + origin +" @ " + this.position.x + "," + this.position.y;
        this.index = id;
    }
    attack(curPlayer){}
    move(newCoords){
        this.position.copy(newCoords);
    }
    createPathTree()
    {
        this.scanPath(this.position.x, this.position.y, this.paths, 0);
    }
    //direction indexes:
    //came from the top: 3
    //came from the left: 2
    //came from the bottom: 1
    //came from the right: 4
    scanPath(originX, originY, parent, cameFromDir) {
        if((inRange(originX,-1,5))&&(inRange(originY,-1,5))){ //quick hacky check

        parent[0] = new THREE.Vector2(originX, originY);
        let linkIndex = 0;
        console.log("parent: " + originX + ", " +  originY);
        const upperSlotX = originX;
        const upperSlotY = originY - 1;
        const rightSlotX = originX + 1;
        const rightSlotY = originY;
        const bottomSlotX = originX;
        const bottomSlotY = originY + 1;
        const leftSlotX = originX - 1;
        const leftSlotY = originY;
        
        if(cameFromDir != 3){linkIndex = this.checkSlot(upperSlotX,upperSlotY, parent, 1, linkIndex);} //check upper
        if(cameFromDir != 4){linkIndex = this.checkSlot(rightSlotX,rightSlotY, parent, 2, linkIndex);} //check right
        if(cameFromDir != 1){linkIndex = this.checkSlot(bottomSlotX,bottomSlotY, parent, 3, linkIndex);} //check bottom
        if(cameFromDir != 2){linkIndex = this.checkSlot(leftSlotX,leftSlotY, parent, 4, linkIndex);} //check left

        }
    }
    checkSlot(X,Y, array,cameFromDir, linkIndex)
    {
        console.log("checking " + X + ", " + Y);
        if((inRange(X,-1,5))&&(inRange(Y,-1,5))){
        if (table.slots[X][Y].env == Colors[this.nativeWorldIndex]) { // table coords: X down, Y to the right
            let link = new Array();
            linkIndex++;
            array.push(link);
            console.log("found child: " + X + ", " +  Y + " cololr: " + Colors[this.nativeWorldIndex]);
            this.scanPath(X, Y, array[linkIndex], cameFromDir);
        }}
        
        return linkIndex;
    }
    defineDirection(){}
    playTurn(){
        this.createPathTree();
        this.defineDirection();
        this.move();
    }
}

class World{
    constructor(WI)
    {
        this.WI = WI;                               
        this.env = new Array(tableRows);             //for now just color
        this.creatures = new Array(tableRows);       
        this.generateCreaturesRand();
        this.fillEnv();
    }

    generateCreaturesRand() //generate one for debugging
    { let creatureIndex = 0;
        for (let i = 0; i < tableRows; i++) {
            this.creatures[i] = new Array(tableColumns); // make each element an array
            for(let j = 0; j< tableColumns; j++)
            {   
                if(!((i==player.position.X)&&(j==player.position.Y))&&(getRandomInt(10)%7==0))//kinda randomly populate //change to player coords
                {
                    this.creatures[i][j] = new Creature(i,j,this.WI,creatureIndex);//to access - number of creation
                    creatureIndex++;
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

AI = { //to be generalized later
    health: 100,
    hand: new Array(handCount),
    dealCards()
        {
            for(let i=0;i<handCount;i++)
            {this.hand[i] = deck.pop();}
            updateScreen(player);
        },
    drawCardsToFull()
        {
            let cardsToDraw = handCount - this.hand.length;
            for(let i=0;i<cardsToDraw;i++)
            {this.hand[i] = deck.pop();}
            updateScreen(player);
        },
    playTurn(){
        console.log("AI plays");
        updateScreen(player);
    }
}

const GameLogic = 
{
    worldRespond()
    {
        //game makes moves
        console.log("World response");
    },
    
    gameLoopSinglePlayer()
    {
        if(player.state==PlayerStates.WAITING){
            GameLogic.worldRespond();
            AI.playTurn();
            GameLogic.worldRespond();
            player.state = PlayerStates.CARD_SELECT;
            updateScreen(player);
        }
    },
}

class Player
{   
    constructor(X,Y)
    {this.health = 100;
    this.hand = new Array(handCount);
    this.position = new THREE.Vector2(X,Y);
    this.selectedCardIndex;
    this.selectedSlotCoords = new THREE.Vector2(0,0);
    this.state = PlayerStates.CARD_SELECT;
    }
    dealCards()
    {
        for(let i=0;i<handCount;i++)
        {this.hand[i] = deck.pop();}
        updateScreen(this);
    }
    drawCardsToFull()
    {
        let cardsToDraw = handCount - this.hand.length;
        for(let i=0;i<cardsToDraw;i++)
        {this.hand[i] = deck.pop();}
        updateScreen(this);
    }
    drawCards(cardsToDraw)
    {
        for(let i=0;i<cardsToDraw;i++)
        {this.hand[i] = deck.pop();}
        updateScreen(this);
    }
    selectCard(index)
    {
        if(this.state==PlayerStates.CARD_SELECT)
        {  this.selectedCardIndex = index;
            console.log("selected card: " + this.hand[this.selectedCardIndex]);
            this.hand[this.selectedCardIndex].activate(this);
        }
        else{alert("Cannot select a card yet!");}
        updateScreen(this);
    }
    selectSlot(X,Y)
    {
        if(this.state==PlayerStates.SLOT_SELECT){
            this.selectedSlotCoords.x = X;
            this.selectedSlotCoords.y = Y;
        }
        updateScreen(this);
    }
    playTurn()
    {
        if(this.state!=PlayerStates.WAITING)
            {if(this.selectedCardIndex!=undefined)        //add check!
            {
                console.log("card: " + this.hand[this.selectedCardIndex]);
                this.hand[this.selectedCardIndex].play(this);
                this.state = PlayerStates.WAITING;//change to wait later!
                updateScreen(this);
            }
            else{alert("A card has to be selected first");}}
        else{
         alert("Wait for your turn"); }
        
    }
};

function initGame() {
   
    player = new Player(2,3);
     normalWorld = new World(0);
     world1 = new World(1);
     world2 = new World(2);
     worlds = [];
    worlds.push(normalWorld,world1,world2);
    table.initialize();
    initializeDeck();
    console.log(player);
    player.dealCards();
    updateScreen();
}

function initializeDeck() {
card0 = new FlipCard(Shapes.CORNER_UPPER_LEFT, Shapes.CORNER_UPPER_LEFT_I);
card1 = new FlipCard(Shapes.CORNER_UPPER_RIGHT,Shapes.CORNER_UPPER_RIGHT_I);
card2 = new FlipCard(Shapes.CORNER_LOWER_LEFT,Shapes.CORNER_LOWER_LEFT_I);
card3 = new FlipCard(Shapes.CORNER_LOWER_RIGHT,Shapes.CORNER_LOWER_RIGHT_I);

card4 = new FlipCard(Shapes.CROSS,Shapes.CROSS_I);

card5 = new FlipCard(Shapes.SIDE_LEFT,Shapes.SIDE_LEFT_I);
card6 = new FlipCard(Shapes.SIDE_RIGHT,Shapes.SIDE_RIGHT_I);
card7 = new FlipCard(Shapes.SIDE_UPPER,Shapes.SIDE_UPPER_I);
card8 = new FlipCard(Shapes.SIDE_LOWER,Shapes.SIDE_LOWER_I);

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
function updateScreen(curPlayer)
{   

    for(let i = 0;i<tableRows;i++){
        for(let j=0;j<tableColumns;j++){
            document.getElementById("tcell"+i+j).style.background = table.slots[i][j].env; //color
            creature = table.slots[i][j].content;
            if(creature!=undefined){document.getElementById("tcell"+i+j).innerHTML = creature.toString;}
            else{document.getElementById("tcell"+i+j).innerHTML = "";}
            

            if((curPlayer.selectedSlotCoords.x==i)&&(curPlayer.selectedSlotCoords.y==j))//update slot selection:
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

setInterval(GameLogic.gameLoopSinglePlayer,250);


function DebugLog() {
    
    console.log(table);
}