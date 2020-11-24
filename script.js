var canvas = document.getElementById("graph");
var ctx = canvas.getContext('2d');
function Node(x, y, weight) {
	this.x = x;
	this.y = y;
	this.weight = weight;
}
var array = []
function getInput() {
	var inputField = document.getElementById("node-data")
	var lines = inputField.value.split('\n');
	for(var i=0; i<lines.length; i++) {
		var node_values = lines[i].split(' ');
		var tmp_node = new Node(node_values[0], node_values[1], node_values[2]);
		array.push(tmp_node);
	}
}
ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.beginPath()
//variables begin
var startingX = 25;
var startingY = 25;
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var centerX = canvasWidth/2;
var centerY = canvasHeight/2;
var scale = 9;
//variables end
function drawGraph() {
	getInput();
	console.log("Drawing graph!");
	ctx.moveTo(centerX, centerY);
	for(var i=0;i<array.length;i++) {
	
	ctx.lineTo(array[i].x*scale, array[i].y*scale);
	ctx.stroke();
	ctx.strokeText(i + " ("+array[i].weight.toString()+")", array[i].x*scale, array[i].y*scale-5 )
	
	ctx.moveTo(centerX, centerY);
	//console.log(array[i].x*scale, array[i].y*scale)
	}
}
// ----WORKING WITH THE TABLE-----
//creating the table as an array
function createTable() {
table = []
for(var i=0;i<10;i++) {
		var newArr = []
		table.push(newArr);
		for(var j=0;j<10; j++) {
			if(j==i) newArr.push("<b>" + i.toString() + "</b>"); //fill in the diagonal
			else {
				var isAbove = true;
				for(var i2 = i; i2 >= 0; i2--) { //test if the cell is below the diagonal
					if(i2==j) isAbove = false;
				} 
				if(isAbove)newArr.push(getDistance(array[i], array[j]))
				else newArr.push(getImprovement(array[i], array[j]));
				
			}
		}
	}
}
var testarr =
[
  ["row 1, cell 1", "row 1, cell 2"], 
  ["row 2, cell 1", "row 2, cell 2"]
]
function drawTable() { // building the HTML
	createTable();
	console.log("Drawing table")
	myArray = table;
    var result = "<table border=1>";
	result += "<td>  </td>"
	result += "<td colspan=100%>Матрица расстояний между пунктами (dij), км</tr>"
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
			if(j==0&&i==0) {
				result += "<td rowspan=100%>"+"Матрица <br>километровых <br>выигрышей(sij), км"+"</td>";
			}
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    document.getElementById("table").innerHTML = result;
}


// math functions here
function getDistance(node1, node2) {
	return round_frac(Math.sqrt((node2.x - node1.x)*(node2.x - node1.x) + (node2.y - node1.y)*(node2.y - node1.y)));
}
function getImprovement(node1, node2) {
	var centerNode = new Node(centerX/scale, centerY/scale, -1) //creates a fake node in the center of the graph
	var half_radial1 = getDistance(node1, centerNode);
	var half_radial2 = getDistance(node2, centerNode);
	var total_radial = half_radial1*2 + half_radial2*2;
	var new_route = half_radial1 + getDistance(node1, node2) + half_radial2;
	var improvement = total_radial - new_route;
	if(improvement<0) improvement = 0;
	return improvement;
}
function round_frac(value) {
    if((value%1)!=0 return value.toFixed(2);
	else return value;
}
