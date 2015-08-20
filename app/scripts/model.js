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
	// graph that is searched
	this.graph = new GraphModel(this, this.get('undirected'), 'true');
	// search tree that is constructed during the search process
	this.tree = new TreeModel(this);
	// fringe that stores intermediate search results
	this.fringe = new FringeModel(this);
	// closed list that stores nodes that have already been searched
	this.closedList = [];
	// what search algorithm are we using?
	this.searchAlgorithm = this.get('searchAlgorithm');
	// the question bank stores a list of questions and the answer history
	//this.questionBank = new QuestionBank(this, this.get('numerator'), this.get('denominator'), this.get('firstQuestion'), this.get('lastQuestion'));
}


SimModel.prototype.search = function(_startNodeIndex, _searchAlgorithm, _graphSearch) {
	//
	// start with...
	//
	// an empty fringe
	this.fringe = [];
	// an empty tree
	this.treeNodes = [];
	this.treeEdges = [];
	// an empty closed list
	this.closedList = [];
	//
	// initialize the search
	//
	this.newTreeRoot(_startNodeIndex);
	//
	// search
	//
	// as long as we have nodes in the fringe...
	while (this.fringe.length > 0) {
		//
		// take the next node off the fringe
		//
		var parentTreeNode = this.getNextNodeFromFringe(_searchAlgorithm);
		var parentGraphNode = this.nodes[parentTreeNode.lastNode()];
		//
		// Am I done?
		//
		if (parentGraphNode.goalTest()) return parentTreeNode;
		//
		// Expand the node
		//
		var childrenGraphNodes = parentGraphNode.expand();
		//
		// Add the kids to the fringe
		//
		for (var child = 0; child < childrenGraphNodes.lenth; child++) {
			// get the index of the next child node
			var childIndex = childrenGraphNodes[child];
			// if we are using a closed list, check to make sure we haven't already
			// seen this node
			if (_graphSearch && this.closedList.indexOf(childIndex) >= 0) continue;
			// add node to closed list
			this.closedList.push(childIndex)
			// create a new tree node

		}
	}
}
