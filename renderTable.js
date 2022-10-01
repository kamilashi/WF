
function GenerateTable(){
let divTable = document.getElementById('table');
let row = 5, col = 5;
str = '';
for(i = 0; i < row; i++)
{
    str += '<tr id="tr'+i+'">';
    for (j = 0; j < col; j++){
        str += '<td id="tcell' + i + j + '" onclick="selectCard(this,' + j + ')"></td>';
    }
    str += '</tr>';
}
console.log(str);
table.innerHTML = str;

}


function GenerateHand(){
            r += parseInt(Math.random() * 10); 
            g += parseInt(Math.random() * 10); 
            b += parseInt(Math.random() * 10);
return 'rgb('+r+','+g+','+b+')';
}