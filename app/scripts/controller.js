/*
 * main.js
 * Rich Simpson
 * August 4, 2015
 *
 * This code implements a mastery-based exercise on graph
 * theory for integration with Smart Sparrow.
 *
 * This is our controller - The C in MVC
 */


/*
 * Create the sim controller
 */
function GraphController() {
	// create a data model that exposes parameters to smart sparrow
	this.dataModel = new DataModel(this, {
		mastery: 'false',			// true when mastery condition is satisfied
		numerator: 4,					// must get <numerator> questions right...
		denominator: 5,				// out of the last <denominator> questions
		undirected: 'true',		// directed or undirected edges in graph
		firstQuestion: 0,			// index of first question in question bank
		lastQuestion: 0,			// index of last question in question bank
	});
	//
	// expose model data to Smart Sparrow
	//
	pipit.CapiAdapter.expose('mastery', this.dataModel);
	pipit.CapiAdapter.expose('numerator', this.dataModel);
	pipit.CapiAdapter.expose('denominator', this.dataModel);
	pipit.CapiAdapter.expose('undirected', this.dataModel);
	pipit.CapiAdapter.expose('firstQuestion', this.dataModel);
	pipit.CapiAdapter.expose('lastQuestion', this.dataModel);
	// let smart sparrow know that the sim is ready to accept values
	pipit.Controller.notifyOnReady();
	// initialize the data model
	this.dataModel.initializeDataModel();
	// initialize the view
	this.graphView = new GraphView(this);
	this.setupDisplay();
}


GraphController.prototype.setModelValue = function(_name, _newValue) {
	this.dataModel.set(_name, _newValue);
}


GraphController.prototype.getModelValue = function(_name) {
	return this.dataModel.get(_name);
}


GraphController.prototype.triggerCheck = function() {
	pipit.Controller.triggerCheck();
}

GraphController.prototype.setupDisplay = function() {
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
	this.graphView.drawGraph(this.dataModel.graph.graphNodes, this.dataModel.graph.graphEdges, this.dataModel.graph.undirected);
	// draw the results for the last five questions
	this.graphView.drawAnswerHistory(this.dataModel.questionBank.answerHistory);
	// choose a new set of random questions
	this.dataModel.questionBank.createNewQuestions();
	// choose a question randomly
	this.dataModel.questionBank.chooseQuestion();
	// display the next question
	this.graphView.presentQuestion();
}


// Create a new Controller for sim
// The controller interacts with the model and the view
var graphController = new GraphController();


$(document).ready(function() {
	// let smart sparrow know that the sim is ready to accept values
	//pipit.Controller.notifyOnReady();
});
