console.log("script started");
var center;
var used = false;
var adj;
function solve() {
	getInput();
	scale = document.getElementById("scale-input").value;
	startingX = document.getElementById("startingX").value
	startingY = document.getElementById("startingY").value
	capacity = document.getElementById("capacity").value
	adj = createAdjascencyMatrix();

	
	drawGraph();
	drawTable(table);
	//ClarkeWright();
	used = true;
}



// --------CANVAS STUFF---------
var canvas = document.getElementById("graph");
var ctx = canvas.getContext('2d');

//variables begin
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var centerX = canvasWidth/2;
var centerY = canvasHeight/2;
var scale;
var startingX = document.getElementById("startingX").value
var startingY = document.getElementById("startingY").value
var capacity = document.getElementById("capacity").value
//variables end

function Node(x, y, weight) {
	this.x = x;
	this.y = y;
	this.weight = weight;
	this.conn1 = center;
	this.conn2 = center;
}

var array = []

function getInput() {
	array = [];
	center = new Node(startingX, startingY, -1);
	array.push(center);
	var inputField = document.getElementById("node-data")
	var lines = inputField.value.split('\n');
	for(var i=0; i<lines.length; i++) {
		var node_values = lines[i].split(' ');
		var tmp_node = new Node(node_values[0], node_values[1], node_values[2]);
		array.push(tmp_node);
	}
}

ctx.beginPath()
ctx.fillStyle = 'rgb(0, 0, 200)'


function drawGraph() { //coords: array[i].x*scale, array[i].y*scale
	if(used) {ctx.clearRect(0,0,canvasWidth, canvasHeight)
	}
	
	len = array.length;
	for(var i=0;i<array.length;i++) {
		var adjascent = getAdjascentNodes(i);
		console.log("adj: " + adjascent)
		
		for(var conn=0; conn<adjascent.length; conn++) {
			ctx.beginPath(); //draw all the connections
			ctx.moveTo(array[i].x*scale, array[i].y*scale);
			ctx.lineTo(array[adjascent[conn]].x*scale, array[adjascent[conn]].y*scale);
		ctx.stroke();
		}
		if(i==0) ctx.fillStyle = 'rgb(200, 0, 0)';
		ctx.fillRect(array[i].x*scale,array[i].y*scale,5,5);
		ctx.fillStyle = 'rgb(0, 0, 200)'
		ctx.closePath();
		ctx.beginPath();
		if(i!=0)ctx.strokeText((i) + " ("+array[i].weight.toString()+")", array[i].x*scale, array[i].y*scale-5)
		ctx.moveTo(array[i].x*scale, array[i].y*scale);
		ctx.closePath();
	
	}
}
// ----WORKING WITH THE TABLE----
//creating the table as an array

function createTable(arg) { //arg = normal | above | below
	var table = []
	for(var i=0;i<array.length;i++) {
		var newArr = []
		table.push(newArr);
		for(var j=0;j<array.length; j++) {
			if(j==i) newArr.push("<b>" + (i).toString() + "</b>"); //fill in the diagonal
			else {
				var isAbove = true;
				for(var i2 = i; i2 >= 0; i2--) { //test if the cell is below the diagonal
					if(i2==j) isAbove = false;
				} 
				if(isAbove&&arg=="normal") newArr.push(round(getDistance(array[i], array[j])))
				else if((!isAbove)&&arg=="normal") newArr.push((getImprovement(array[i], array[j])));
			
				if(isAbove&&arg=="above" )newArr.push(round(getDistance(array[i], array[j])))
				else if((!isAbove)&&arg=="above") newArr.push(-1);
				
				if(isAbove&&arg=="below") newArr.push(-1)
				else if((!isAbove)&&arg=="below") newArr.push((getImprovement(array[i], array[j])));
			
				
			}
		}
	}
	return table;
}
function createAdjascencyMatrix() {
	var matrix = [];
	var len = array.length
	for(var i=0; i < len; i++){
      matrix.push([]);
      matrix[i].push( new Array(len));

      for(var j=0; j < len; j++){
        if((i!=0)&&(j!=0))matrix[i][j] = 0;
		else matrix[i][j] = 1;
      }
	}
	matrix[0][0] = 0;
	return matrix;
}

function getAdjascentNodes(i) {
	var adjascent = [];
	for(var k=0; k<array.length; k++) {
		if(adj[i][k]==1) adjascent.push(k);
	}
	return adjascent;
}

function drawTable(myArray) { // building the HTML
	let table = createTable("normal");
	myArray = table; //table
	console.log("Drawing table!")
    var result = "<table border=1>";
	result += "<td>  </td>"
	result += "<td colspan=100%>Матрица расстояний между пунктами (d<sub>ij</sub>), км</tr>"
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
			if(j==0&&i==0) {
				result += "<td rowspan=100%>"+"Матрица <br>километровых <br>выигрышей(s<sub>ij</sub>), км"+"</td>";
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
	return (Math.sqrt((node2.x - node1.x)*(node2.x - node1.x) + (node2.y - node1.y)*(node2.y - node1.y)));
}
function getImprovement(node1, node2) {
	var centerNode = new Node(startingX, startingY, -1) //creates a fake node in the center of the graph
	var half_radial1 = getDistance(node1, centerNode);
	var half_radial2 = getDistance(node2, centerNode);
	var total_radial = ((half_radial1) + (half_radial2))*2;
	var new_route = half_radial1 + half_radial2 + getDistance(node1, node2);
	var improvement = total_radial - new_route;
	if(improvement<0) improvement = 0;
	return round(improvement);
}
function round(value) {
    if((value%1)==0) return value
	else return value.toFixed(2);
}

// ----ALGORITHM----
function ClarkeWright() {
	var sum = 0;
	function removeCenterConnection() {
	for(var i=0; i<adj.length; i++) {
		var numOfConnections = 0;
		for(var j=0; j<adj.length; j++) {
			if(adj[i][j]==1) numOfConnections += 1;
		}
		if(numOfConnections>2) {
			adj[0][i] = 0;
			adj[i][0] = 0;
		}
	}
	}
	function connect(i, j) {
		adj[i][j] = 1;
		adj[j][i] = 1;
		removeCenterConnection(i);
	}
	function testConditions(i, j) {
		var cond1 = (parseInt(array[iToConnect].weight)+parseInt(array[jToConnect].weight))<=capacity;
		return cond1;
	}
	var a = 0;
	savingsTable = createTable("below");
	
	while(a<2) { // main loop
		maxResult = maxFrom2DArray(savingsTable);
		smax = maxResult[0];
		var iToConnect = maxResult[2]
		var jToConnect = maxResult[1]
		console.log("i: " + iToConnect + "j: " + jToConnect);
		if(testConditions(iToConnect, jToConnect)) connect(iToConnect, jToConnect);
		savingsTable[jToConnect][iToConnect] = -1;
		used = true;
		a = a+1;
	}
	drawGraph();
	
	return sum;
	
}
function maxFrom2DArray(arr) { //returns array: [max, i, j]
	var max;
	var result = [];
	for(var i=0; i<arr.length;i++) {
		for(var j=0; j<arr.length; j++) {
			if(i==j) arr[i][j] = -1;	 //remove the diagonal
		}
	}
	flattened = arr.flat() // it's 4 pm babe
	max = Math.max.apply(null, flattened)
	result.push(max);
	for(var i=0; i<arr.length;i++) {//find i and j
		for(var j=0; j<arr.length; j++) {
			if(arr[i][j]==max){
				result.push(i);
				result.push(j)
			}
		}
	}
	return result;

}