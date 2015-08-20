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
function SimController() {
	// create a data model that exposes parameters to smart sparrow
	this.simModel = new SimModel(this, {
		mastery: 'false',					// true when mastery condition is satisfied
		numerator: 4,							// must get <numerator> questions right...
		denominator: 5,						// out of the last <denominator> questions
		undirected: 'true',				// directed or undirected edges in graph
		firstQuestion: 0,					// index of first question in question bank
		lastQuestion: 0,					// index of last question in question bank
		searchAlgorithm: 'DFS',		// search algorithm to use
	});
	//
	// expose model data to Smart Sparrow
	//
	pipit.CapiAdapter.expose('mastery', this.simModel);
	pipit.CapiAdapter.expose('numerator', this.simModel);
	pipit.CapiAdapter.expose('denominator', this.simModel);
	pipit.CapiAdapter.expose('undirected', this.simModel);
	pipit.CapiAdapter.expose('firstQuestion', this.simModel);
	pipit.CapiAdapter.expose('lastQuestion', this.simModel);
	pipit.CapiAdapter.expose('searchAlgorithm', this.simModel);
	// let smart sparrow know that the sim is ready to accept values
	pipit.Controller.notifyOnReady();
	// initialize the data model
	//this.simModel.resetSimModel();
	// initialize the view
	this.simView = new SimView(this);
	//this.simView.resetDisplay();
}


SimController.prototype.setModelValue = function(_name, _newValue) {
	this.dataModel.set(_name, _newValue);
}


SimController.prototype.getModelValue = function(_name) {
	return this.dataModel.get(_name);
}


SimController.prototype.triggerCheck = function() {
	pipit.Controller.triggerCheck();
}


SimController.prototype.resetSim = function() {
	// reset the model
	this.simModel.resetSimModel();
	// reset the display
	this.simView.resetSimView();
}

// Create a new Controller for sim
// The controller interacts with the model and the view
var simController = new SimController();


$(document).ready(function() {
});
