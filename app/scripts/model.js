/*
 * models.js
 * Rich Simpson
 * August 4, 2015
 *
 * This code implements a mastery-based exercise on graph
 * theory for integration with Smart Sparrow.
 *
 * This is our data model - The M in MVC
 */


/*
 * I use this function to empty out all of the arrays that
 * I use in this program.
 */
function emptyOutArray(myArray) {
	myArray.length = 0;
}


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function SimModel(_controller, _attrs) {
	// save a link to the controller
	this.controller = _controller;
	// we want DataModel to inherit from CapiModel so SmartSparrow
	// can access values within the model - here I call the CapiModel
	// constructor
	pipit.CapiAdapter.CapiModel.call(this, _attrs);
	// flag is true when we are mid-search
	this.searching = false;
	// what search algorithm are we using?
	this.searchAlgorithm = this.get('searchAlgorithm');
	// are we using the closed list?
	this.graphSearch = this.get('graphSearch') == 'true';
}
	// the things below are in the data model so I don't declare them here
	// this flag is set to true when the mastery condition is reached
	//this.mastery = false;
	// this is the numerator for the mastery condition - how many right
	//this.masteryNumerator = 4;
	// this is the denominator for the mastery condition - out of how many total?
	//this.masteryDenominator = 5;
	// the graph is directed or undirected
	// this.undirected = _undirected;
	// the index of the first legal question template in the template array
	// this.firstQuestion = 0
	// the index of the last legal question template in the template array
	// this.lastQuestion = 4


/*
 * This defines CapiModel as the prototype for GraphModel, so we inherit
 * from CapiModel
 */
SimModel.prototype = new pipit.CapiAdapter.CapiModel;


/*
 * Initialize the components of the data model
 */
SimModel.prototype.resetSimModel = function() {
	// graph that is searched - it's always undirected and weighted
	this.graph = new GraphModel(this, 'true', 'true');
	// search tree that is constructed during the search process
	this.tree = new TreeModel(this);
	// fringe that stores intermediate search results
	this.fringe = new FringeModel(this);
	// closed list that stores nodes that have already been searched
	this.closedList = [];
	// the question bank stores a list of questions and the answer history
	//this.questionBank = new QuestionBank(this, this.get('numerator'), this.get('denominator'), this.get('firstQuestion'), this.get('lastQuestion'));
}


SimModel.prototype.startSearch = function(_startGraphNodeIndex) {
	// create a root for the tree
	this.tree.newTreeRoot(_startGraphNodeIndex);
	// add the node to the fringe - _path, _totalCost, _heuristic, _searchTreeNodeIndex
	this.fringe.addNode([_startGraphNodeIndex], 0, this.graph.heuristic(_startGraphNodeIndex), 0);
	// add the node to the closed list
	this.closedList.push(_startGraphNodeIndex);
	// set the searching flag to true
	this.searching = true;
	// set solution to empty
	this.solution = [];
}


SimModel.prototype.endSearch = function(_solution) {
	// set the searching flag to false
	this.searching = false;
	// set the solution
	this.solution = _solution;
	// show the solution
	this.controller.simView.showSolution();
}


SimModel.prototype.searchStep = function() {
	// if we haven't started searching yet
	// we always start the search with the first node in the graph
	if (! this.searching) {
		this.startSearch(0);
		return;
	}
	// if the fringe is empty then no solution exists
	if (this.fringe.length == 0) {
		this.endSearch([]);
	}
	//
	// take the next node off the fringe
	//
	var nextFringeNode = this.fringe.getNextNodeFromFringe(this.searchAlgorithm);
	console.log(nextFringeNode.path);
	var parentTreeNodeIndex = nextFringeNode.searchTreeNodeIndex;
	var parentGraphNodeIndex = nextFringeNode.lastNodeInPath();
	//
	// Am I done?
	//
	if (this.graph.goalTest(parentGraphNodeIndex)) {
		this.endSearch(nextFringeNode.path);
		return;
	};
	//
	// Expand the node
	//
	var childrenGraphNodes = this.graph.expand(parentGraphNodeIndex);
	//
	// Add the kids to the fringe
	//
	for (var child = 0; child < childrenGraphNodes.length; child++) {
		// get the index of the next child node
		var childIndex = childrenGraphNodes[child];
		// if we are using a closed list, check to make sure we haven't already
		// seen this node
		if (this.graphSearch && this.closedList.indexOf(childIndex) >= 0) continue;
		// add node to closed list
		this.closedList.push(childIndex)
		// get cost of edge from parent graph node to child graph node and...
		var edgeCost = this.graph.edgeCost(parentGraphNodeIndex, childIndex);
		// add it to the cost of the path up to this point to get the total cost
		var totalPathCost = nextFringeNode.totalCost + edgeCost;
		// create a new tree node and add it to tree - _newGraphNodeIndex, _edgeCost, _parentTreeNodeIndex
		var newTreeNodeIndex = this.tree.newTreeNode(childIndex, edgeCost, parentTreeNodeIndex);
		// get the heuristic value
		var heuristic = this.graph.heuristic(childIndex);
		// create a new fringe node - _path, _totalCost, _heuristic, _searchTreeNodeIndex
		this.fringe.addNode(this.tree.treeNodes[newTreeNodeIndex].path, totalPathCost, heuristic, newTreeNodeIndex);
		}
}
