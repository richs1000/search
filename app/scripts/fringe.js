/*
 * Each node in the fringe represents a node in the search tree. Each node
 * in the search tree represents a unique path through the graph.
 */
function FringeNode(_path, _totalCost, _heuristic, _searchTreeNodeIndex) {
	// the path through the graph - stored as an array of node indexes
	this.path = _path;
	// the total cost of the path through the graph
	this.totalCost = _totalCost;
	// the heuristic value of the tree node is the heuristic value of the
	// last node in the path represented by the node
	this.heuristic = _heuristic;
	// this points to the index of the corresponding node in the tree
	this.searchTreeNodeIndex = _searchTreeNodeIndex;
}


/*
 * Return the node index of the last node in the path represented by this
 * tree node. I need the last node in order to expand the tree node.
 */
FringeNode.prototype.lastNodeInPath = function() {
	return this.path[this.path.length - 1];
}


/*
 * The g-score is used by the A* algorithm. It combines the total cost of
 * the path (i.e., looking backwards) and the heuristic (i.e., looking
 * forwards).
 */
FringeNode.prototype.gScore = function() {
	return this.totalCost + this.heuristic;
}


/*
 * The fringe is represented as an ordered list of nodes.
 */
function FringeModel(_simModel) {
	// save a link to the model
	this.simModel = _simModel;
	// store the fringe as an ordered list
	this.fringeNodes = [];
}


FringeModel.prototype.addNode = function(_path, _totalCost, _heuristic, _searchTreeNodeIndex) {
	// create a new fringe node object
	var newFringeNode = new FringeNode(_path, _totalCost, _heuristic, _searchTreeNodeIndex);
	// push it on to the end of the fringe
	this.fringeNodes.push(newFringeNode);
}


/*
 * Return a list of all the nodes that have the lowest cost. For use in
 * uniform cost search
 */
FringeModel.prototype.lowestCost = function() {
	//
	// find the lowest cost
	//
	// start with the first node...
	var minCost = this.fringeNodes[0].totalCost;
	// loop through the rest
	for (var i = 1; i < this.fringeNodes.length; i++) {
		// compare the lowest value we found with the current node's cost
		if (this.fringeNodes[i].totalCost < minCost) {
			// keep track of the lowest value we find
			minCost = this.fringeNodes[i].totalCost;
		}
	}
	//
	// create a list of nodes with the lowest total cost
	//
	// start with an empty list
	var nodeList = [];
	// loop through the nodes
	for (i = 0; i < this.fringeNodes.length; i++) {
		// compare the lowest value we found with the current node's cost
		if (this.fringeNodes[i].totalCost == minCost) {
			// add it to the list
			nodeList.push(i);
		}
	}
	// return the list
	return nodeList;
}


/*
 * Return a list of all the nodes that have the lowest heuristic. For use in
 * greedy search
 */
FringeModel.prototype.lowestHeuristic = function() {
	//
	// find the lowest cost
	//
	// start with the first node...
	var minHeuristic = this.fringeNodes[0].heuristic;
	// loop through the rest
	for (var i = 1; i < this.fringeNodes.length; i++) {
		// compare the lowest value we found with the current node's cost
		if (this.fringeNodes[i].heuristic < minHeuristic) {
			// keep track of the lowest value we find
			minHeuristic = this.fringeNodes[i].heuristic;
		}
	}
	//
	// create a list of nodes with the lowest total cost
	//
	// start with an empty list
	var nodeList = [];
	// loop through the nodes
	for (i = 0; i < this.fringeNodes.length; i++) {
		// compare the lowest value we found with the current node's cost
		if (this.fringeNodes[i].heuristic == minHeuristic) {
			// add it to the list
			nodeList.push(i);
		}
	}
	// return the list
	return nodeList;
}


/*
 * Return a list of all the nodes that have the lowest g-score. For use in
 * A* search
 */
FringeModel.prototype.lowestGScore = function() {
	//
	// find the lowest g-score
	//
	// start with the first node...
	var minScore = this.fringeNodes[0].gScore();
	// loop through the rest
	for (var i = 1; i < this.fringeNodes.length; i++) {
		// compare the lowest value we found with the current node's score
		if (this.fringeNodes[i].gScore() < minScore) {
			// keep track of the lowest value we find
			minScore = this.fringeNodes[i].gScore();
		}
	}
	//
	// create a list of nodes with the lowest total cost
	//
	// start with an empty list
	var nodeList = [];
	// loop through the nodes
	for (i = 0; i < this.fringeNodes.length; i++) {
		// compare the lowest value we found with the current node's cost
		if (this.fringeNodes[i].gScore() == minScore) {
			// add it to the list
			nodeList.push(i);
		}
	}
	// return the list
	return nodeList;
}


/*
 * Which node is removed from the fringe depends on which algorithm we
 * are using
 */
FringeModel.prototype.getNextNodeFromFringe = function(_searchAlgorithm) {
	// BFS - take node at front of fringe (added least recently)
	if (_searchAlgorithm == 'BFS') {
		return this.fringeNodes.shift();
	// DFS - take node at back of fringe (added most recently)
	} else if (_searchAlgorithm == 'DFS') {
		return this.fringeNodes.pop();
	// UCS - take node with lowest total path cost
	} else if (_searchAlgorithm == 'UCS') {
		var eligibleNodes = this.lowestCost();
	// Greedy - take node with lowest heuristic
	} else if (_searchAlgorithm == 'Greedy') {
		var eligibleNodes = this.lowestHeuristic();
	// A* - take node with lowest g-score
	} else {
		var eligibleNodes = this.lowestGScore();
	}
	var chosenNode = this.fringeNodes.splice(eligibleNodes[0], 1);
	return chosenNode[0];
}
