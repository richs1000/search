/*
 * This object handles drawing the interface for the questions on the screen.
 */
function QuestionBankView(_dataview) {
	// keep a link to the controller
	this.dataview = _dataview;
	// set up graph view
	//this.setupQuestionBankView();
}



QuestionBankView.prototype.getStudentAnswer = function() {
	// adjacency matrix question
	if (this.controller.graphModel.questionIndex == 0)
		return this.getAdjacencyMatrix();
	else
		return this.getAdjacencyList();
}


QuestionBankView.prototype.presentQuestion = function() {
	// display the new question
	$( "#lblQuestion" ).text(this.dataview.controller.dataModel.questionBank.question);
}

/*
 * draw squares for each answer we'll consider - for example,
 * if we want 3 out of 5 correct to establish mastery then
 * we want to draw 5 squares. Then fill in each square based
 * on whether the answer was correct or incorrect.
 */
QuestionBankView.prototype.drawAnswerHistory = function(answerHistory) {
	// clear the answer history display
	$( ".answerHistory" ).empty();
	// loop through all the items in the queue
	for (i = 0; i < answerHistory.length; i++) {
		id = 'id = answerBlock' + i;
		// if we haven't provided an answer yet
		if (answerHistory[i] == null) {
			$( ".answerHistory" ).append( "<div " + id + " class='answerBlock noAnswer'></div>" );
		// if the answer was right
		} else if (answerHistory[i] == true) {
			$( ".answerHistory" ).append( "<div class='answerBlock rightAnswer'></div>" );
		// if the answer was wrong
		} else {
			$( ".answerHistory" ).append( "<div class='answerBlock wrongAnswer'></div>" );
		}
	}
}
