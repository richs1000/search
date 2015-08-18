function TreeNode(_path, _totalPathCost) {
	// each tree node represents a unique path through the graph
	// represented as a list of indices for the graph nodes array
	this.path = _path;
}


/*
 * Return the node index of the last node in the path represented by this
 * tree node. I need the last node in order to expand the tree node.
 */
TreeNode.prototype.lastNode = function() {
	return this.path[this.path.length - 1];
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
		totalCost += this.dataModel.graph.edgeCost(fromNodeIndex, toNodeIndex);
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
	var newTreehNode = new TreeNode([_rootNodeIndex]);
	// Add TreeNode object to end of array of nodes
	this.treeNodes.push(newTreeNode);
	// Add TreeNode object to the end of the fringe
	this.fringe.push(newTreeNode);
}


TreeModel.prototype.newTreeNode = function(_newGraphNodeIndex, _parentTreeNodeIndex) {
	// the path consists of the path stored in the parent tree node + the new node index
	// start by copying the parent's path
	var nodePath = this.treeNodes[_parentTreeNodeIndex].path.slice();
	// add the child
	nodePath.push(_newGraphNodeIndex);
	// Create a TreeNode object
	var newTreehNode = new TreeNode(nodePath);
	// Add TreeNode object to end of array of nodes
	this.treeNodes.push(newTreeNode);
	// Add TreeNode object to the end of the fringe
	this.fringe.push(newTreeNode);
}
