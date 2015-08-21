function ClosedListView(_simView) {
	// keep a link to the view
	this.simView = _simView;
}


ClosedListView.prototype.drawClosedList = function(_closedList) {
	// erase the old fringe
	$( "#closedListDiv" ).html('');
	// start with an empty string
	var bigClosedListString = "";
	// add each node into the closed list
	for (var i = 0; i < _closedList.length; i++) {
		// index of the node within the graph nodes list
		var nodeIndex = _closedList[i];
		// add the name to the path string
		bigClosedListString += this.simView.controller.simModel.graph.graphNodes[nodeIndex].nodeName + " ";
	}
	$( '#closedListDiv').append( bigClosedListString );
}
