/*
 * This object handles drawing the interface on the screen. Mostly
 * this involves drawing the actual graph and clearing out the
 * text field for the user's answer
 */
function GraphView(_view) {
	// keep a link to the controller
	this.view = _view;
	// handle for graph canvas
	this.graphCanvas = document.getElementById('graphCanvas');
	// handle for graph canvas context
	this.graphContext = this.graphCanvas.getContext('2d');
	// erase the canvas
	this.graphContext.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
	// set canvas to 1/3 width of window
	//this.graphContext.canvas.width  = (window.innerWidth / 3) - 10;
	// set radius for each node
	this.graphNodeRadius = 20;
	// create an array filled with objects. each object stores:
	// - the x and y position of the node within the canvas,
	// - the id of the node
	// - a flag for whether or not it should be drawn
	this.graphNodes = [
		{x:50, y:50, name:'A', draw: true},
		{x:150, y:50, name:'B', draw: true},
		{x:250, y:50, name:'C', draw: true},
		{x:350, y:50, name:'D', draw: true},
		{x:50, y:150, name:'E', draw: true},
		{x:150, y:150, name:'F', draw: true},
		{x:250, y:150, name:'G', draw: true},
		{x:350, y:150, name:'H', draw: true},
		{x:50, y:250, name:'I', draw: true},
		{x:150, y:250, name:'J', draw: true},
		{x:250, y:250, name:'K', draw: true},
		{x:350, y:250, name:'L', draw: true},
		{x:50, y:350, name:'M', draw: true},
		{x:150, y:350, name:'N', draw: true},
		{x:250, y:350, name:'O', draw: true},
		{x:350, y:350, name:'P', draw: true}
	];
}


/*
 * Create the graph view. The graph is drawn on a canvas.
 * Each node is represented as a circle. The graph is
 * precomputed
 */
GraphView.prototype.setupGraphView = function() {
	// handle for graph canvas
	this.graphCanvas = document.getElementById('graphCanvas');
	// handle for graph canvas context
	this.graphContext = this.graphCanvas.getContext('2d');
	// erase the canvas
	this.graphContext.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
	// set canvas to 1/3 width of window
	//this.graphContext.canvas.width  = (window.innerWidth / 3) - 10;
	// set radius for each node
	this.graphNodeRadius = 20;
	// create an array filled with objects. each object stores:
	// - the x and y position of the node within the canvas,
	// - the id of the node
	// - a flag for whether or not it should be drawn
	this.graphNodes = [
		{x:50, y:50, name:'A', draw: true},
		{x:150, y:50, name:'B', draw: true},
		{x:250, y:50, name:'C', draw: true},
		{x:350, y:50, name:'D', draw: true},
		{x:50, y:150, name:'E', draw: true},
		{x:150, y:150, name:'F', draw: true},
		{x:250, y:150, name:'G', draw: true},
		{x:350, y:150, name:'H', draw: true},
		{x:50, y:250, name:'I', draw: true},
		{x:150, y:250, name:'J', draw: true},
		{x:250, y:250, name:'K', draw: true},
		{x:350, y:250, name:'L', draw: true},
		{x:50, y:350, name:'M', draw: true},
		{x:150, y:350, name:'N', draw: true},
		{x:250, y:350, name:'O', draw: true},
		{x:350, y:350, name:'P', draw: true}
	];
}


/*
 * Draw the graph on the canvas. This function is called by the controller
 * object.
 */
GraphView.prototype.drawGraph = function(_nodes, _edges, _undirected) {
	// erase the canvas
	this.graphContext.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
	//this.graphContext.canvas.width  = (window.innerWidth / 3) - 10;
	// draw all the nodes
	this.drawNodes(_nodes);
	// draw the edges between the nodes
	this.drawEdges(_edges, _undirected);
}


/*
 * Draw the edges between nodes. Edges can be undirected or directed.
 */
GraphView.prototype.drawEdges = function(edges, undirected) {
	// make sure we have a canvas and a context
	if (this.graphCanvas.getContext) {
		// loop through the edges array
		for	(var index = 0; index < edges.length; index++) {
			// get the edge
			var edge = edges[index]
			this.drawEdge(edge.fromNodeIndex, edge.toNodeIndex, edge.cost, undirected, edge.doubleEdge);
		}
	} // if we have a context
}


/*
 * Given the id of the start node and the end node, and a flag indicating
 * whether the edge is undirected or directed, draw an edge between two nodes
 */
GraphView.prototype.drawEdge = function(startNode, endNode, cost, undirected, doubleEdge) {
	// if the cost is -1 then we don't need to draw it, so we're done
	if (cost == -1) return;
	// make sure we have a canvas to draw in
	if (this.graphCanvas.getContext) {
		// start the drawing path
		this.graphContext.beginPath();
		// all the edges are drawn in black
 		this.graphContext.strokeStyle = "black";
		//
		// get edge starting and ending coordinates
		//
		// get starting x,y coordinates
		var startX = this.graphNodes[startNode].x;
		var startY = this.graphNodes[startNode].y;
		// get ending x,y coordinates
		var endX = this.graphNodes[endNode].x;
		var endY = this.graphNodes[endNode].y;
		//
		// adjust x coordinate of start and end points to
		// begin drawing at edge of nodes
		//
		// if the start node is to the left of the end node
		if (startX != endX) {
			if (startX < endX) {
				startX += this.graphNodeRadius;
				endX -= this.graphNodeRadius;
			// if the start node is to the right of the end node
			} else if (startX > endX) {
				startX -= this.graphNodeRadius;
				endX += this.graphNodeRadius;
			}
		// nodes are on top of each other
		}  else if (startX == endX) {
			// if the start node is above the end node
			if (startY < endY) {
				startY += (this.graphNodeRadius + 5);
				endY -= (this.graphNodeRadius + 5);
			// if the start node is below the end node
			} else if (startY > endY) {
				startY -= (this.graphNodeRadius + 5);
				endY += (this.graphNodeRadius + 5);
			}
		}
		//
		// adjust y coordinate of start and end points to
		// begin drawing at edge of nodes
		//
		// if the start node is above the end node
		if (startY != endY && startX != endX) {
			if (startY < endY) {
				startY += this.graphNodeRadius;
				endY -= this.graphNodeRadius;
			// if the start node is below the end node
			} else if (startY > endY) {
				startY -= this.graphNodeRadius;
				endY += this.graphNodeRadius;
			}
		// nodes are at same height
		} else if (startY != endY){
			if (startX < endX) {
				startX += (this.graphNodeRadius + 5);
				endX -= (this.graphNodeRadius + 5);
			// if the start node is to the right of the end node
			} else if (startX > endX) {
				startX -= (this.graphNodeRadius + 5);
				endX += (this.graphNodeRadius + 5);
			}
		}
		//
		// draw a line from start to end
		//
		// move to the start of the line
		this.graphContext.moveTo(startX, startY);
		// draw the line
		this.graphContext.lineTo(endX, endY);
		// close the drawing path
		this.graphContext.closePath();
		// fill in the line on the canvas
		this.graphContext.stroke();
		//
		// if it's directed, we add an arrow on the end -
		// we do this by adding a horizontal and vertical line
		// http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
		//
		if (! undirected) {
			// calculate the angle of the line
			var lineangle = Math.atan2(endY - startY, endX - startX);
			// h is the line length of a side of the arrow head
			var h = Math.abs(10 / Math.cos(Math.PI/8));
			//
			var angle1 = lineangle+Math.PI+(Math.PI/8);
  		var topx = endX + Math.cos(angle1)*h;
  		var topy = endY + Math.sin(angle1)*h;
			var angle2 = lineangle+Math.PI-(Math.PI/8);
		  var botx = endX + Math.cos(angle2)*h;
		  var boty = endY + Math.sin(angle2)*h;
		  // draw
			this.graphContext.save();
			this.graphContext.beginPath();
			this.graphContext.moveTo(topx,topy);
			this.graphContext.lineTo(endX,endY);
			this.graphContext.lineTo(botx,boty);
			this.graphContext.stroke();
		}
		//
		// if we have a cost, add costs to the graph
		//
		if (cost > 0 && ! doubleEdge) {
			// set the font for the cost
			this.graphContext.textAlign = "center";
			this.graphContext.textBaseline = "bottom";
			this.graphContext.fillStyle = "red";
			this.graphContext.font = "12pt Helvetica";
			// get position for cost
			var costX = (startX + (endX - startX) / 6);
			var costY = startY + (endY - startY) / 6;
			// create a string for the cost value
			var costString = cost.toString();
			// draw the cost string
			this.graphContext.fillText(costString, costX, costY);
		}
	} // if we have a context
}


/*
 * Draw all the nodes in the graph. nodes is an array of GraphNode
 * objects
 */

GraphView.prototype.drawNodes = function(nodes) {
	// make sure we have a canvas and a context
	if (this.graphCanvas.getContext) {
		// loop through the list of nodes
		for (index = 0; index < nodes.length; index++) {
			this.drawNode(index);
		} // loop over all nodes in graph
	} // if we have a context
}


/*
 * Draw an individual node. node is a GraphNode object
 */
GraphView.prototype.drawNode = function(index) {
	// start the drawing path
	this.graphContext.beginPath();
 	// draw nodes in black
 	this.graphContext.strokeStyle = "black";
	// move the pen to the starting point of the node
	// if I don't do this I get lines between each circle I draw
	// I have to offset the x value because x is in the center of the circle
	this.graphContext.moveTo(this.graphNodes[index].x + this.graphNodeRadius,
							this.graphNodes[index].y);
	// draw the node
	this.graphContext.arc(	this.graphNodes[index].x,	// x
							this.graphNodes[index].y, 	// y
							this.graphNodeRadius, 		// radius
							0, 							// start angle
							Math.PI * 2, 				// end angle
							true);						// clockwise
 	// draw the node on the canvas
	this.graphContext.stroke();
	// set the font for the node ID
	this.graphContext.textAlign = "center";
	this.graphContext.textBaseline = "bottom";
	this.graphContext.fillStyle = "black";
	this.graphContext.font = "12pt Helvetica";
	// draw the node ID
	this.graphContext.fillText(this.graphNodes[index].name, this.graphNodes[index].x, this.graphNodes[index].y);
	// set the font for the node's heuristic value
	this.graphContext.textAlign = "center";
	this.graphContext.textBaseline = "top";
	this.graphContext.fillStyle = "black";
	this.graphContext.font = "10pt Helvetica";
	// create a string for the heuristic value
	var hString = "h=" + this.view.controller.simModel.graph.heuristic(index);
	// draw the heuristic string
	this.graphContext.fillText(hString, this.graphNodes[index].x, this.graphNodes[index].y);
}
