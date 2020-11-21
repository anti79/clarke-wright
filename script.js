console.log("script started");
var center;
var used = false;
function solve() {
	scale = document.getElementById("scale-input").value;
	center = new Node(startingX, startingY, -1);
	if(used) {
		array = []
	}
	drawGraph();
	drawTable(table);
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
	var inputField = document.getElementById("node-data")
	var lines = inputField.value.split('\n');
	for(var i=0; i<lines.length; i++) {
		var node_values = lines[i].split(' ');
		var tmp_node = new Node(node_values[0], node_values[1], node_values[2]);
		array.push(tmp_node);
	}
}
ctx.fillStyle = 'rgb(0, 0, 200)';
ctx.beginPath()



function drawGraph() {
	if(used) ctx.clearRect(0,0,canvasWidth, canvasHeight)
	getInput();
	console.log("Drawing graph!");
	for(var i=0;i<array.length;i++) {
		ctx.beginPath();
		ctx.moveTo(array[i].x*scale, array[i].y*scale);
		ctx.lineTo(array[i].conn1.x*scale, array[i].conn1.y*scale);
		ctx.stroke();
		ctx.fillRect(array[i].x*scale,array[i].y*scale,5,5);
		ctx.strokeText((i+1) + " ("+array[i].weight.toString()+")", array[i].x*scale, array[i].y*scale-5)
		ctx.moveTo(array[i].x*scale, array[i].y*scale);
	
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
			if(j==i) newArr.push("<b>" + (i+1).toString() + "</b>"); //fill in the diagonal
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



function drawTable(myArray) { // building the HTML
	let table = createTable("normal");
	myArray = table;
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
	savingsTable = createTable("below");
	smax = maxFrom2DArray(savingsTable);
	
	
}
function maxFrom2DArray(arr) {
	var max;
	for(var i=0; i<arr.length;i++) {
		for(var j=0; j<arr.length; j++) {
			if(i==j) arr[i][j] = -1;	 //remove the diagonal
		}
	}
	flattened = arr.flat() // it's 4 pm babe
	max = Math.max.apply(null, flattened)
	console.log(max)

}