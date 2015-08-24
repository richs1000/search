/*
 * main.js
 * Rich Simpson
 * August 5, 2015
 *
 * This code implements a mastery-based exercise on graph
 * theory for integration with Smart Sparrow.
 *
 * This is our view - The V in MVC
 */


/*
 * This object handles drawing the interface on the screen. Mostly
 * this involves drawing the actual graph and clearing out the
 * text field for the user's answer
 */
function SimView(_controller) {
	// keep a link to the controller
	this.controller = _controller;
	// Only set up the controls once
	this.setupControls();
}


SimView.prototype.showSolution = function() {
	// show the solution
	this.solutionView.drawSolution( this.controller.simModel.solution );
	// de-activate the step button
	$( "#btnStep" ).prop('disabled', true)
}


SimView.prototype.updateDisplay = function() {
	// draw the graph - nodes, edges, undirected
	this.graphView.drawGraph(	this.controller.simModel.graph.graphNodes,
														this.controller.simModel.graph.graphEdges,
														this.controller.simModel.graph.undirected);
	// draw the tree

	// draw the fringe
	this.fringeView.drawFringe( this.controller.simModel.fringe );
	// draw the closed list
	this.closedListView.drawClosedList( this.controller.simModel.closedList );
}


SimView.prototype.resetSimView = function() {
	// create a view controller for the graph
	this.graphView = new GraphView(this);
	// create a view controller for the tree
	this.treeView = new TreeView(this);
	// create a view controller for the fringe
	this.fringeView = new FringeView(this);
	// create a view controller for the closed list
	this.closedListView = new ClosedListView(this);
	// create a view controller for the solution
	this.solutionView = new SolutionView(this);
	// re-draw the display
	this.updateDisplay();
	// erase the old solution
	$( "#solutionDiv" ).html('');
	// re-display all th esearch buttons
	this.displaySearchButtons();
}


SimView.prototype.displaySearchButtons = function() {
	// here are all the buttons
	var listOfButtons = ['BFS', 'DFS', 'UCS', 'Greedy', 'AStar', 'Tree', 'Graph'];
	// loop through the buttons
	for (var i = 0; i < listOfButtons.length; i++) {
		// create the id string
		var idString = '#btn' + listOfButtons[i];
		// hide that button
		$( idString ).show();
	}
}


SimView.prototype.changeSearchAlgorithm = function(_searchAlgorithm) {
	// if we are already searching, you can't change the algorithm
	if (this.controller.simModel.searching) return;
	// otherwise, change the algorithm
	simController.simModel.searchAlgorithm = _searchAlgorithm;
	//
	// make the other buttons disappear
	//
	// here are all the search algorithms
	var listOfButtons = ['BFS', 'DFS', 'UCS', 'Greedy', 'AStar'];
	// take out the search algorithm we chose
	listOfButtons.splice(listOfButtons.indexOf(_searchAlgorithm), 1);
	// loop through the rest of the buttons
	for (var i = 0; i < listOfButtons.length; i++) {
		// create the id string
		var idString = '#btn' + listOfButtons[i];
		// hide that button
		$( idString ).hide();
	}
}


// SimView.prototype.hideSearchButtons = function() {
// 	// if we are already searching, you can't change the algorithm
// 	if (this.controller.simModel.searching) return;
// 	// otherwise, change the algorithm
// 	simController.simModel.searchAlgorithm = '_searchAlgorithm';
// }


SimView.prototype.setupControls = function() {
	// add event for reset button
	$( " #btnReset ").click(function() {
		// create a new graph, empty the display
		simController.resetSim();
		// re-display the search algorithm and graph/tree buttons
		$( ".btnSearch" ).show();
		// reactivate the step button
		$( "#btnStep" ).prop('disabled', false);
	});
	// add event for step button
	$( "#btnStep").click(function() {
		// pick a node from the fringe, expand it
		simController.simModel.searchStep();
		// update the display
		simController.simView.updateDisplay();
	});
	// add event for search algorithm buttons
	$( "#btnDFS" ).click(function () {
		simController.simView.changeSearchAlgorithm('DFS');
	});
	$( "#btnBFS" ).click(function () {
		simController.simView.changeSearchAlgorithm('BFS');
	});
	$( "#btnUCS" ).click(function () {
		simController.simView.changeSearchAlgorithm('UCS');
	});
	$( "#btnGreedy" ).click(function () {
		simController.simView.changeSearchAlgorithm('Greedy');
	});
	$( "#btnAStar" ).click(function () {
		simController.simView.changeSearchAlgorithm('AStar');
	});

	$( "#btnTree" ).click(function () {
		// switch to tree searchStep
		simController.simModel.graphSearch = false;
		// hide graph search button
		$( "#btnGraph" ).hide();
	});
	$( "#btnGraph" ).click(function () {
		// switch to tree searchStep
		simController.simModel.graphSearch = true;
		// hide graph search button
		$( "#btnTree" ).hide();
	});
}
