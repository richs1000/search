/*
 * GraphNode represents the nodes within the state space graph.
 * A graph node has a unique ID. Depending on the search
 * algorithm being used, it may or may not have a heuristic
 * value indicating the node's distance from the goal node,
 * where a larger value indicates greater distance from the
 * goal. The node also has an array for keeping track of all
 * the times it appears in the search tree.
 */
function GraphNode(_nodeName) {
	// Node name - the state represented by this node
	this.nodeName = _nodeName || '';
} // GraphNode


/*
 * GraphEdge represents the edges/arcs between nodes in the
 * graph. A graph edge has a start node, an end node and a
 * cost, which may or may not be considered by the search
 * algorithm. For an undirected edge, you can either treat
 * a single edge as undirected or create two separate edges.
 */
function GraphEdge(_fromNodeIndex, _toNodeIndex, _cost) {
	// start node - index = position in nodes array
	this.fromNodeIndex = _fromNodeIndex || 0;
	// end node - index = position in nodes array
	this.toNodeIndex = _toNodeIndex || 0;
	// cost of edge (g value)
  this.cost = _cost || 0;
	// is this a single edge or a double edge?
	this.doubleEdge = false;
} // GraphEdge


function GraphModel(_dataModel, _undirected, _weighted) {
	// store a pointer to the data model
	this.dataModel = _dataModel;
	// set flag for whether this is a directed or undirected graph
	this.undirected = _undirected == 'true';
	// set flag for whether this is a weighted or unweighted graph
	this.weighted = _weighted == 'true';
	// create a new graph
	this.createNewGraph();
}


GraphModel.prototype.heuristic = function (_graphNodeIndex) {
	var rowLen = 4;
	var colLen = 4;
	var targetIndex = rowLen * colLen - 1;
	var targetRow = rowLen - 1;
	var targetCol = colLen - 1;
	var nodeRow = Math.floor(_graphNodeIndex / rowLen);
	var nodeCol = _graphNodeIndex % colLen;
	return (targetRow - nodeRow) + (targetCol - nodeCol);
};


GraphModel.prototype.goalTest = function(_graphNodeIndex) {
	return this.graphNodes[_graphNodeIndex].nodeName == 'P';
}


/*
 * In a real search algorithm, the expand function would be part of the
 * node class. Since my graph is pre-made, I can put it in the graph
 * object.
 */
GraphModel.prototype.expand = function(_graphNodeIndex) {
	var expansionList = [];
	// go through all the edges
	for (var e = 0; e < this.graphEdges.length; e++) {
		// if we find an edge with the target node at the head...
		if (this.graphEdges[e].fromNodeIndex == _graphNodeIndex) {
			// add the tail to the expansion list
			expansionList.push(this.graphEdges[e].toNodeIndex);
		}
	}
	return expansionList;
}


/*
* This function empties out any old nodes from a previous graph and
* creates brand new nodes.
 * This function also gets rid of any old edges and then stores three
 * equivalent representations of the connections between nodes. The
 * edges list is what I actually use internally. The adjacency list
 * and adjacency matrix are used to answer questions posed to the
 * user.
*/
GraphModel.prototype.createNewGraph = function() {
	// This as a quick, cheap way to store each node's neighbors.
	// Each list contains all the nodes that could connect to the
	// index node
	var neighborList = [
		[1, 4, 5],										// A = 0
		[0, 2, 4, 5, 6],							// B = 1
		[1, 3, 5, 6, 7],							// C = 2
		[2, 6, 7],										// D = 3
		[0, 1, 5, 8, 9],							// E = 4
		[0, 1, 2, 4, 6, 8, 9, 10],		// F = 5
		[1, 2, 3, 5, 7, 9, 10, 11],		// G = 6
		[2, 3, 6, 10, 11],						// H = 7
		[4, 5, 9, 12, 13],						// I = 8
		[4, 5, 6, 8, 10, 12, 13, 14],	// J = 9
		[5, 6, 7, 9, 11, 13, 14, 15],	// K = 10
		[6, 7, 10, 14, 15],						// L = 11
		[8, 9, 13],										// M = 12
		[8, 9, 10, 12, 14],						// N = 13
		[9, 10, 11, 13, 15],					// O = 14
		[10, 11, 14],									// P = 15
	];
	// reset array of nodes
	this.graphNodes = [];
	// reset array of edges - starts off empty
	this.graphEdges = [];
	// create nodes and edges
	for (var startNodeIndex = 0;  startNodeIndex < neighborList.length; startNodeIndex++) {
		// add the node to our list of nodes - create a name for the node by
		// converting from a number (0...) to letter (A...)
		this.addNodeToGraph(String.fromCharCode(startNodeIndex+65));
		// choose some number of neighbors to remove (remove at least one, keep at least one)
		var removeCount = getRandomInt(1, neighborList[startNodeIndex].length);
		// randomly choose that many nodes to remove
		for (var count = 0; count < removeCount; count++) {
			// pick a random index
			index = getRandomInt(0, neighborList[startNodeIndex].length);
			// pull that item out of the array
			neighborList[startNodeIndex].splice(index, 1);
		}
		// create an edge for all the nodes remaining in the neighbors array
		for (var i=0; i < neighborList[startNodeIndex].length; i++) {
			// get the other side of the edge
			var endNodeIndex = neighborList[startNodeIndex][i];
			// if there is already an edge between these two nodes
			if (this.edgeIndex(endNodeIndex, startNodeIndex) >= 0) {
				//  use the same cost for both edges
				var edgeCost = this.edgeCost(endNodeIndex, startNodeIndex);
				// we will draw the cost for the "partner" to this edge - this way
				// the cost is only drawn once
				var doubleEdge = true;
			// if there isn't already an edge between these two nodes,
			} else {
				// pick a random cost for the edge
				var edgeCost = getRandomInt(1, 10);
				// make sure we do show the cost
				var doubleEdge = false;
			}
			// add the edge and its cost to the graph model
			this.addEdgeToGraph(startNodeIndex, endNodeIndex, edgeCost, doubleEdge);
			// if this is an undirected graph, then add an edge in the other direction
			if (this.undirected) {
				// add the "opposite" edge and its cost to the graph model
				this.addEdgeToGraph(endNodeIndex, startNodeIndex, edgeCost, true);
			}
		}
	}
}


/*
 * This function returns the index of a tree node based on its ID
 */
GraphModel.prototype.nodeIndex = function(_nodeName) {
	// loop through nodes in tree
	for	(var index = 0; index < this.graphNodes.length; index++) {
		// check whether the current nodeID is the target nodeID
	    if (this.graphNodes[index].nodeName == _nodeName)
	    	// return the index of the target nodeID within the
	    	// node array
	    	return index;
	}
	// return -1 to indicate that the nodeID wasn't found
	return -1;
}


/*
 * This function returns the index of an edge based on its
 * fromNodeID and toNodeID
 */
GraphModel.prototype.edgeIndex = function(_fromNodeIndex, _toNodeIndex) {
	// loop through edges in tree
	for	(var index = 0; index < this.graphEdges.length; index++) {
		// check whether the current nodeID is the target nodeID
	    if (this.graphEdges[index].fromNodeIndex == _fromNodeIndex &&
	    	this.graphEdges[index].toNodeIndex == _toNodeIndex)
	    	// return the index of the target nodeID within the
	    	// node array
	    	return index;
	}
	// return -1 to indicate that the nodeID wasn't found
	return -1;
}


/*
 * This function returns the cost of an edge based on its
 * fromNodeID and toNodeID
 */
GraphModel.prototype.edgeCost = function(_fromNodeIndex, _toNodeIndex) {
	// loop through edges in tree
	for	(var index = 0; index < this.graphEdges.length; index++) {
		// check whether the current nodeID is the target nodeID
	    if (this.graphEdges[index].fromNodeIndex == _fromNodeIndex &&
	    	this.graphEdges[index].toNodeIndex == _toNodeIndex)
	    	// return the index of the target nodeID within the
	    	// node array
	    	return this.graphEdges[index].cost;
	}
	// return -1 to indicate that the nodeID wasn't found
	return -1;
}


/*
 * This function is used to add a node to the nodes array
 */
GraphModel.prototype.addNodeToGraph = function(_nodeName) {
	// does the node already exist?
	if (this.nodeIndex(_nodeName) >= 0) return;
	// Create a GraphNode object
	var newGraphNode = new GraphNode(_nodeName);
	// Add GraphNode object to end of array of nodes
	this.graphNodes.push(newGraphNode);
}


/*
 * This function is used to add an edge to the edges array
 */
GraphModel.prototype.addEdgeToGraph = function(_fromNodeIndex, _toNodeIndex, _cost, _doubleEdge) {
	// are the from and to nodes the same?
	if (_fromNodeIndex == _toNodeIndex) return;
	// Is cost at least 0?
	if (_cost < 0) return;
	// does the edge already exist?
	if (this.edgeIndex(_fromNodeIndex, _toNodeIndex) >= 0) return;
	// Create a GraphEdge object
	var newGraphEdge = new GraphEdge(_fromNodeIndex, _toNodeIndex, _cost);
	// set the doubleEdge flag
	newGraphEdge.doubleEdge = _doubleEdge
	// Add GraphEdge object to array of graphEdges
	this.graphEdges.push(newGraphEdge);
}


/*
 * This function dumps the contents of the node array in no particular
 * order.
 */
GraphModel.prototype.dumpGraph = function() {
	// loop through the nodes array
	for	(var index = 0; index < this.graphNodes.length; index++) {
		// print out ID of each node
		console.log("Index: " + index + " ID: " + this.graphNodes[index].nodeName);
	}
	// loop through the edges array
	for	(var index = 0; index < this.graphEdges.length; index++) {
		// print out details about each edge
		console.log("Index: " + index + " from: " + this.graphEdges[index].fromNodeIndex
						+ " toID: " + this.graphEdges[index].toNodeIndex + " cost: " + this.graphEdges[index].cost);

	}
}
