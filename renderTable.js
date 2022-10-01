function Init(){
    GenerateTable();
    GenerateHand();
}

function GenerateTable(){
let divTable = document.getElementById('table');
let row = 5, col = 5;
str = '';
for(i = 0; i < row; i++)
{
    str += '<tr id="tr'+i+'">';
    for (j = 0; j < col; j++){
        str += '<td id="tcell' + i + j + '" onclick="selectSlot(this,' + j + ')"></td>';
    }
    str += '</tr>';
}
console.log(str);
table.innerHTML = str;

}


function GenerateHand(){
    let row = 5;
    for (j = 0; j < col; j++){
        str += '<td id="tcell' + i + j + '" onclick="selectCard(this,' + j + ')"></td>';
    }
}
