function SolutionView(_simView) {
	// keep a link to the view
	this.simView = _simView;
}


SolutionView.prototype.drawSolution = function(_solution) {
	// erase the old fringe
	$( "#solutionDiv" ).html('');
	// start with an empty string
	var bigSolutionString = "";
	// add each node into the closed list
	for (var i = 0; i < _solution.length; i++) {
		// index of the node within the graph nodes list
		var nodeIndex = _solution[i];
		// add the name to the path string
		bigSolutionString += this.simView.controller.simModel.graph.graphNodes[nodeIndex].nodeName + " ";
	}
	$( '#solutionDiv').append( bigSolutionString );
}
