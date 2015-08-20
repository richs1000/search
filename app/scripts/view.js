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


SimView.prototype.updateDisplay = function() {
	// draw the graph - nodes, edges, undirected
	this.graphView.drawGraph(	this.controller.simModel.graph.graphNodes,
														this.controller.simModel.graph.graphEdges,
														this.controller.simModel.graph.undirected);
	// draw the tree

	// draw the fringe

	// draw the closed list

}


SimView.prototype.resetSimView = function() {
	// create a view controller for the graph
	this.graphView = new GraphView(this);
	// create a view controller for the tree
	this.treeView = new TreeView(this);
	// create a view controller for the fringe
	this.fringeView = new FringeView(this);
	// create a view controller for the closed list
	//this.closedListView = new ClosedListView(this);
	// create a view cotroller for the question bank
	//this.questionBankView = new QuestionBankView(this);
	// re-draw the display
	this.updateDisplay();
	// present the question

/*
	// flip a coin to decide if the graph is directed or undirected
	var coin = getRandomInt(0, 2);
	// set the directed/undirected flag
	if (coin == 0)
		this.setModelValue('undirected', 'false');
	else
		this.setModelValue('undirected', 'true');
	// create a brand new graph - randomly choose nodes and edges
	this.dataModel.graph.createNewGraph();
	// draw the graph on the screen
	this.dataView.graphView.drawGraph(this.dataModel.graph.graphNodes, this.dataModel.graph.graphEdges, this.dataModel.graph.undirected);
	// draw the results for the last five questions
	this.dataView.questionBankView.drawAnswerHistory(this.dataModel.questionBank.answerHistory);
	// choose a new set of random questions
	this.dataModel.questionBank.createNewQuestions();
	// choose a question randomly
	this.dataModel.questionBank.chooseQuestion();
	// display the next question
	this.dataView.questionBankView.presentQuestion();
*/
}




SimView.prototype.setupControls = function() {
	// add event for reset button
	$( " #btnReset ").click(function() {
		// create a new graph, empty the display
		simController.resetSim();
		// re-activate the search buttons
		$( ".btnSearch" ).prop('disabled', false);
	});
	// add event for step button
	$( " #btnStep ").click(function() {
		// de-activate the search buttons
		$( ".btnSearch" ).prop('disabled', true);
		// pick a node from the fringe, expand it
		graphController.simModel.nextStep();
		// update the display
		graphController.simView.updateDisplay();
	});
}
