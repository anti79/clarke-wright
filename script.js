console.log("script started");
var center;
var used = true;
var adj;
var routes = [];
function worstfixever() {
	solve();

}
function solve() {
	
	scale = document.getElementById("scale-input").value;
	startingX = document.getElementById("startingX").value;
	startingY = document.getElementById("startingY").value;
	capacity = document.getElementById("capacity").value;
	getInput();
	generateRoutes();
	drawGraph();
	drawTable(table);
	ClarkeWright();
	printResults();
	
}
function printResults()
{
	document.getElementById("results").innerHTML = JSON.stringify(routes)
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
	center = new Node(startingX, startingY, 0);
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
function generateRoutes() {
	for(var i=1; i<array.length; i++) {
		var radialRoute = []
		radialRoute.push(0)
		radialRoute.push(i);
		radialRoute.push(0)
		routes.push(radialRoute);
		console.log("generating radials")
	}
	
}
generateRoutes()
function drawGraph() { //coords: array[i].x*scale, array[i].y*scale
	if(used) {ctx.clearRect(0,0,canvasWidth, canvasHeight)}
	for(var route=0;route<routes.length;route++) {
		for(var node = 0; node<routes[route].length-1; node++) {
			var xCoords1 = array[routes[route][node]].x*scale
			var yCoords1 = canvasHeight-array[routes[route][node]].y*scale;
			
			var xCoords2 = array[routes[route][node+1]].x*scale
			var yCoords2 = canvasHeight-array[routes[route][node+1]].y*scale;
			
			ctx.beginPath(); 
			ctx.moveTo(xCoords1, yCoords1);
			ctx.lineTo(xCoords2, yCoords2);
			ctx.stroke();
			if(node==0) ctx.fillRect(xCoords2,yCoords2,5,5);
			else {
				ctx.fillStyle = 'rgb(200, 0, 0)'
				ctx.fillRect(xCoords2,yCoords2,5,5);
			}
			ctx.fillStyle = 'rgb(0, 0, 200)'
			if(node==0) ctx.strokeText((route+1) + " ("+array[route+1].weight.toString()+")", xCoords2, yCoords2-5);
		}
		console.info(routes[route])
	
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

function drawTable(myArray) { // building the HTML
	let table = createTable("normal");
	myArray = table; //table
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
// ----ALGORITHM----
var sum = 0;
var maxValues = [];
var save = 0; 
function ClarkeWright() {
	console.log("running CW");
	
	function getProperOrder(first,second) {
		for(var pair=0; pair<maxValues.length;pair++) {
			if(maxValues[pair].includes(first)&&maxValues[pair].includes(second)) return maxValues[pair];
		}
		
	}
	function getOrder(first, second, array) {
		if(array.indexOf(first)<array.indexOf(second)) return [first, second];
		else return [second, first];
		
	}
	function blockCell(i, j) { //?
		savingsTable[j][i] = -1; 
		savingsTable[i][j] = -1;
	}

	function isOuterNode(node) { 
		if(node==0) console.log("incorrect call")
		for(var rt=0;rt<routes.length;rt++) {
			for(var nd=0; nd<routes[rt].length; nd++) {
				if((routes[rt][nd]==node)&&((routes[rt][nd-1]==0)||(routes[rt][nd+1]==0))) return true;
			}
		}
		return false;
	}
	function bothInRoute(node1, node2) { //+
		for(var c=0; c<routes.length; c++) {
			if((routes[c].includes(node1))&&(routes[c].includes(node2))) return true;
		}
		return false;
		
	}
	function getRouteWeightByNode(node) {
		var routeIndex;
		for(var route=0;route<routes.length;route++) {
			if(routes[route].includes(node)) routeIndex = route;
		}

		var weight = 0;
		for(var node=0;node<routes[routeIndex].length;node++) {
			weight += parseInt(array[routes[routeIndex][node]].weight);
		}
		return weight;
	}
	function getRoute(node) {
		var routeIndex;
		for(var route=0;route<routes.length;route++) {
			if(routes[route].includes(node)) routeIndex = route;
		}
		return routeIndex;
	}
	
		
		
	
	function merge(i, j) {
		var iRoute = getRoute(i); 
		var jRoute = getRoute(j); 
		var iSlice = routes[iRoute].slice(1,-1);
		var jSlice = routes[jRoute].slice(1,-1);
		var conc;
		
		if((iSlice[0]==i)&&(jSlice[jSlice.length-1]==j)) {
			conc = jSlice.concat(iSlice);
			console.log("case1")
		}
		else {
			conc = iSlice.concat(jSlice);
			conc=conc.reverse();
			console.log("case2")
		}

		console.log(i + "   " +j)
		console.log("isl: " + JSON.stringify(iSlice) + " jsl:" + JSON.stringify(jSlice));
		console.log(conc);
		conc.unshift(0);
		conc.push(0);
		routes.splice(iRoute, 1);
		jRoute = getRoute(j); 
		routes.splice(jRoute, 1);
		if(!(routes.includes(conc)))routes.push(conc);
		else {
			console.log("already exists");
			return 0;
		}
	}
	
	var iter = 0;
	savingsTable = createTable("below");
	
	
	
	while(iter<21) { // main loop
		
		maxResult = maxFrom2DArray(savingsTable); 
		smax = maxResult[0];
		var iToConnect = maxResult[2]
		var jToConnect = maxResult[1]
		
		var newRoute = [];
		newRoute.push(jToConnect);
		newRoute.push(iToConnect);
		maxValues.push(newRoute);
		 //get i and j
		
		//пункты i* и  j* не входят в состав одного и того же маршрута
		if(bothInRoute(iToConnect, jToConnect)) {
			iter++;
			blockCell(iToConnect, jToConnect);
			continue;
		}
		
		//пункты i* и j* являются начальным и/или конечным пунктом тех маршрутов, в состав которых они входят (не должны быть внутренними узлами имеющихся маршрутов);
		
		if((!isOuterNode(iToConnect))||(!isOuterNode(jToConnect))) { 
			iter++;
			blockCell(iToConnect, jToConnect);
			continue;
		}
		//q1 + q2 <= c
		if(getRouteWeightByNode(iToConnect)+getRouteWeightByNode(jToConnect)>capacity) {
			iter++;
			blockCell(iToConnect, jToConnect);
			continue;
		}
		
		if((merge(iToConnect, jToConnect))!=0) {
			save+=smax;
			
		}
		blockCell(iToConnect, jToConnect);
	}
	return save;
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