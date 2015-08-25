function TreeNode(_path) {
	// each tree node represents a unique path through the graph
	// represented as a list of indices for the graph nodes array
	this.path = _path;
	// each tree node keeps a list of its kids
	this.children = [];
}


/*
 * Return the node index of the last node in the path represented by this
 * tree node. I need the last node in order to expand the tree node.
 */
TreeNode.prototype.lastNode = function() {
	return this.path[this.path.length - 1];
}


TreeNode.prototype.pathString = function() {
	var pathStr = '';
	for (var i = 0; i < this.path.length; i++) {
		pathStr += String.fromCharCode(65 + this.path[i]);
	}
	return pathStr;
}


// Technically, I don't need to represent the edges explicitly
// for search, but I might need them to ask questions or draw
// the search tree
function TreeEdge(_fromTreeNodeIndex, _toTreeNodeIndex) {
	// an int representing the index in the tree nodes array of
	// the node at the start of this edge
	this.fromTreeNodeIndex = _fromTreeNodeIndex;
	// an int representing the index in the tree nodes array of
	// the node at the end of this edge
	this.toTreeNodeIndex = _toTreeNodeIndex;
}


function TreeModel(_dataModel) {
	// store a pointer to the data model
	this.dataModel = _dataModel;
	// list of all the nodes in the tree
	this.treeNodes = [];
	// list of all the edges in the tree
	this.treeEdges = [];
}


/*
 * Sort the paths into lists based on length. I use this to draw the tree
 */
TreeModel.prototype.sortLevels = function() {
	// start with an empty list of lists, each list stores the indices of
	// tree nodes of the same length
	var lengthLists = [];
	// loop through all the nodes in the tree
	for (var i = 0; i < this.treeNodes.length; i++) {
		// how long is the path represented by this node?
		var pathLength = this.treeNodes[i].path.length;
		// have we seen any paths of this length before?
		if (!(pathLength in lengthLists)) {
			// this is the first one - save the index in a new list
			lengthLists[pathLength] = [i];
		} else {
			// add the index to an existing list
			lengthLists[pathLength].push(i);
		}
	}
	// send back the counts
	return lengthLists;
}


/*
 * Calculate the cost of all the edges that make up the path represented
 * by the tree node
 */
TreeModel.prototype.totalPathCost = function(_treeNodeIndex) {
	// if there is only one node, then the cost = 0
	var totalCost = 0;
	// go through the list of nodes and add up the cost of the edges
	for (var pathIndex = 1; pathIndex < this.treeNodes[_treeNodeIndex].path.length; pathIndex++) {
		// get the start of the edge
		var fromNodeIndex = this.treeNodes[_treeNodeIndex].path[pathIndex - 1];
		// get the end of the edge
		var toNodeIndex = this.treeNodes[_treeNodeIndex].path[pathIndex];
		// add the cost of the current edge
		totalCost += this.simModel.graph.edgeCost(fromNodeIndex, toNodeIndex);
	}
	return totalCost;
}


/*
 * Calculate the heuristic value of a given tree node. The heuristic value is
 * the heuristic value of the graph node at the end of the path represented
 * by the tree node.
 */
TreeModel.prototype.heuristic = function(_treeNodeIndex) {
	// get the graph node at the end of the path
	var graphNodeIndex = this.treeNodes[_treeNodeIndex].lastNode();
	// return the heuristic value of that node
	return this.dataModel.graph.graphNodes[graphNodeIndex].heuristic();
}


TreeModel.prototype.newTreeRoot = function(_rootNodeIndex) {
	// Create a TreeNode object - path is just the root
	var newTreeNode = new TreeNode([_rootNodeIndex]);
	// Add TreeNode object to end of array of nodes
	this.treeNodes.push(newTreeNode);
}


TreeModel.prototype.newTreeNode = function(_newGraphNodeIndex, _edgeCost, _parentTreeNodeIndex) {
	// the path consists of the path stored in the parent tree node + the new node index
	// start by copying the parent's path
	var nodePath = this.treeNodes[_parentTreeNodeIndex].path.slice();
	// add the child - the index of the node in the graph
	nodePath.push(_newGraphNodeIndex);
	// Create a TreeNode object
	var newTreeNode = new TreeNode(nodePath);
	// Add TreeNode object to end of array of nodes
	this.treeNodes.push(newTreeNode);
	// Create the tree edge
	var newTreeEdge = new TreeEdge(_parentTreeNodeIndex, this.treeNodes.length - 1);
	// Add the edge to our array of edges
	this.treeEdges.push(newTreeEdge);
	// update the parent tree node to keep a pointer to the child tree node
	this.treeNodes[_parentTreeNodeIndex].children.push(this.treeNodes.length - 1);
	// return the index of the newly-created tree node
	return this.treeNodes.length - 1;
}
