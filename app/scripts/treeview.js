/*
 * This object handles drawing the interface on the screen. Mostly
 * this involves drawing the actual graph and clearing out the
 * text field for the user's answer
 */
function TreeView(_dataview) {
  this.setupTreeView();
}


/*
 * Create the tree view. The tree is drawn on a canvas.
 * Each node is represented as a circle. Unlike the
 * graph, the tree is computed as the search progresses,
 * so I don't create anything ahead of time.
 */
TreeView.prototype.setupTreeView = function() {
	// handle for tree canvas
	this.treeCanvas = document.getElementById('treeCanvas');
	// handle for tree canvas context
	this.treeContext = this.treeCanvas.getContext('2d');
	// erase the canvas
	this.treeContext.clearRect(0, 0, this.treeCanvas.width, this.treeCanvas.height);
	// set radius for each node
	this.treeNodeRadius = 10;
	// the root node gets drawn in the top center
	this.rootX = this.treeCanvas.width / 2;
	this.rootY = 10;
	// each layer of nodes gets drawn the same distance
	// below the previous layer
	this.verticalSeparation = this.treeNodeRadius * 4;
}


TreeView.prototype.drawTree = function(_tree) {
	// erase the canvas
	this.treeContext.clearRect(0, 0, this.treeCanvas.width, this.treeCanvas.height, _tree);
  // do we have a tree, yet?
  if (_tree.treeNodes.length == 0) return;
  // sort all the tree nodes by path length
  var lengthLists = _tree.sortLevels();
  // we need to keep track of how many nodes are at each depth
	var depthCounts = [];
  // recursively draw the tree
  this.drawTreeNodes( 0,            // start at the root node
                      lengthLists,
                      depthCounts,
                      this.rootX,
                      this.rootY,
                      this.treeCanvas.width,
                      _tree);
}


TreeView.prototype.drawTreeNodes = function(_rootNodeIndex, _lengthLists, _depthCounts, _rootX, _rootY, _columnWidth, _tree) {
  // make sure we have a canvas and a context
  if (this.treeCanvas.getContext) {
    // draw the node
    this.drawTreeNode(_tree.treeNodes[_rootNodeIndex].pathString(), _rootX, _rootY);
    // how deep is this node in the tree?
    var rootNodeDepth = _tree.treeNodes[_rootNodeIndex].path.length;
    // keep track of how many nodes we have left at this level
    // first I have to check whether I have a counter for the
    // current level
    if (!(rootNodeDepth in _depthCounts)) {
      // we haven't started counting at this depth yet, so
      // this is the first one
      _depthCounts[rootNodeDepth] = 1;
    } else {
      // increment the depth counter
      _depthCounts[rootNodeDepth] += 1;
    }
    // loop through the node's children
    for (var c = 0; c < _tree.treeNodes[_rootNodeIndex].children.length; c++) {
      // get the nodeID for the child
      var childIndex = _tree.treeNodes[_rootNodeIndex].children[c];
      // how many nodes have been drawn at the child's depth?
      // first make sure we have a counter
      var nodesInNextLevel = 0;
      if (!(rootNodeDepth+1 in _depthCounts)) {
        // we haven't started counting at this depth yet, so
        // this is the first one
        _depthCounts[rootNodeDepth+1] = 0;
      } else {
        // increment the depth counter
        nodesInNextLevel = _depthCounts[rootNodeDepth+1];
      }
      // how wide is each column
      _columnWidth = this.treeCanvas.width / _lengthLists[rootNodeDepth + 1].length;
      // where is the center of the column we are drawing in?
      // if the node is in column x, we want to go over x-1
      // columns and then half of the xth column
      var xPos = (nodesInNextLevel * _columnWidth) + (_columnWidth / 2);
      // where are the nodes in this depth drawn?
      var yPos = _rootY + this.verticalSeparation;
// 				console.log("\tchild = " + childID + " nINL: " + nodesInNextLevel +
// 							" cW: " + columnWidth + " xPos: " + xPos);
      // recurse!
      this.drawTreeNodes(childIndex,					// ID of the child node
                _lengthLists, 				// counters for how many nodes are at each depth
                _depthCounts,				// counters for how many nodes have we drawn
                xPos,					// center of column
                yPos,					// y position for next level
                _columnWidth,
                _tree);
      // draw edge between root node and child
      // startNodeID, startX, startY, endNodeID, endX, endY
      this.drawTreeEdge(_rootX, _rootY, xPos, yPos);
    } // loop through all the children
  }
}


TreeView.prototype.drawTreeNode = function(nodeID, xPos, yPos) {
	// start the drawing path
	this.treeContext.beginPath();
 	// draw the node in black
	this.treeContext.strokeStyle = "black";
	// move the pen to the starting point of the node
	// if I don't do this I get lines between each circle I draw
	// I have to offset the x value because x is in the center of the circle
	this.treeContext.moveTo(xPos + this.treeNodeRadius, yPos);
/*
	// draw the node
	this.treeContext.arc(	xPos,						// x
							yPos, 						// y
							this.treeNodeRadius, 		// radius
							0, 							// start angle
							Math.PI * 2, 				// end angle
							true);						// clockwise
 	// draw the node on the canvas
	this.treeContext.stroke();
*/
	// set the font for the node ID
	this.treeContext.textAlign = "left";
	this.treeContext.textBaseline = "middle";
	this.treeContext.fillStyle = "black";
	this.treeContext.font = "8pt Helvetica";
	// draw the node ID
	this.treeContext.fillText(nodeID, xPos, yPos);
}


TreeView.prototype.drawTreeEdge = function(startX, startY,endX, endY) {
	if (this.treeCanvas.getContext) {
		// start the drawing path
		this.treeContext.beginPath();
		// all the edges are drawn in black
 		this.treeContext.strokeStyle = "black";
// 		console.log('-----');
// 		console.log('sN: ' + startNode + ' eN: ' + endNode);
// 		console.log('sX: ' + startX + ' sY: ' + startY +
// 					'eX: ' + endX + ' eY: ' + endY);
		// adjust x coordinate of start and end points to
		// begin drawing at edge of nodes
		// if the start node is to the left of the end node
		if (startX < endX) {
			startX += this.treeNodeRadius;
			endX -= this.treeNodeRadius;
		// if the start node is to the right of the end node
		} else if (startX > endX) {
			startX -= this.treeNodeRadius;
			endX += this.treeNodeRadius;
		}
		// adjust y coordinate of start and end points to
		// begin drawing at edge of nodes
		// if the start node is above the end node
		if (startY < endY) {
			startY += this.treeNodeRadius;
			endY -= this.treeNodeRadius;
		// if the start node is below the end node
		} else if (startY > endY) {
			startY -= this.treeNodeRadius;
			endY += this.treeNodeRadius;
		}
// 		console.log('sX: ' + startX + ' sY: ' + startY +
// 					'eX: ' + endX + ' eY: ' + endY);
// 		console.log('-----');
		// move to the start of the line
		this.treeContext.moveTo(startX, startY);
		// draw the line
		this.treeContext.lineTo(endX, endY);
		// close the drawing path
		this.treeContext.closePath();
		// fill in the line on the canvas
		this.treeContext.stroke();
	} // if we have a context
}
