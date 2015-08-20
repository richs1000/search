function FringeView(_simView) {
	// keep a link to the view
	this.simView = _simView;
}


/*
<table id="fringeTable">
	<tr>
		<th>Row #</th>
		<th>Node</th>
		<th>Order Added</th>
		<th>Total Cost</th>
		<th>Heuristic</th>
	</tr>
	<tr>
	</tr>
</table>
*/

FringeView.prototype.drawFringe = function(_fringe) {
	var bigTableString = "";
	bigTableString += "<table id='fringeTable' border='1'>\n";
	// table header
	bigTableString += "<thead>\n";
	bigTableString += "<tr>\n";
	bigTableString += "<th scope='col' text-align='center'>Row #</th>\n"
	bigTableString += "<th scope='col' text-align='center'>Path</th>\n"
	bigTableString += "<th scope='col' text-align='center'>Order Added</th>\n"
	bigTableString += "<th scope='col' text-align='center'>Total Cost</th>\n"
	bigTableString += "<th scope='col' text-align='center'>Heuristic</th>\n"
	bigTableString += "</tr>\n";
	bigTableString += "</thead>\n";
	// table body
	bigTableString += "<tbody>\n";
	// one row for each node in fringe
	for (var f = 0; f < _fringe.fringeNodes.length; f++) {
		//start a new row
		bigTableString += "<tr>\n";
		bigTableString += "<th scope='row' text-align='center'>" + f + "</th>\n";
		bigTableString += "<td>" + _fringe.fringeNodes[f].path + "</td>\n";
		bigTableString += "<td>" + f + "</th>\n";
		bigTableString += "<td>" + _fringe.fringeNodes[f].totalCost + "</td>\n";
		bigTableString += "<td>" + _fringe.fringeNodes[f].heuristic + "</td>\n";
		// end the row
		bigTableString += "</tr>\n";
	}
	// close the table
	bigTableString += "</tbody>\n";
	bigTableString += "</table>\n";
	$( '#fringeTableDiv').append( bigTableString );
}
