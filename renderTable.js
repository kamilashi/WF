var slotInd = [];
var handCardInd = [];

var tableRows = 5;
var tableColumns = 5;
var handCount = 5;


function Init(){

    slotInd = new Array(tableRows); // create an empty array of length tableRows
    for (let i = 0; i < tableRows; i++) {
        slotInd[i] = new Array(tableColumns); // make each element an array
    }

    handCardInd =  new Array(handCount);

    DrawTable(tableRows,tableColumns);
    DrawHand(handCount);

    console.log(slotInd);
}

function DrawTable(row,  col){
    let table = document.getElementById('table');
    str = '';
    for(let i = 0; i < row; i++)
    {   
        str += '<tr id="tr'+i+'">';
        for (let j = 0; j < col; j++){
            slotInd[i][j] = ''+i+j;
            str += '<td id="tcell' + i + j + '" onclick="player.selectSlot(' + i +',' + j + ')"></td>';
        }
        str += '</tr>';
    }
    table.innerHTML = str;
}

function DrawHand(col){
    let table = document.getElementById('hand');
    str = '';
    str +='<tr id = "hr0">';
    for (let i = 0; i < col; i++){
        handCardInd[i] = ''+i;
        str += '<td id="hcell' + i + '" onclick="player.selectCard(' + i + ')"></td>';
    }
    str += '</tr>';
    table.innerHTML = str;
}


