function QuestionBank(_dataModel, _numerator, _denominator, _firstQuestion, _lastQuestion) {
	// store a pointer to the data model
	this.dataModel = _dataModel;
	// we need to keep track of the last <x> answers we've gotten
	// so we can test for mastery. we use an array as a queue that
	// stores as many answers as we're willing to consider
	this.answerHistory = [];
	// initialize the question bank
	this.createNewQuestions();
	// the number of questions you need to get right
	this.numerator = _numerator;
	// out of the last how many questions
	this.denominator = _denominator;
	// index of the first question in the question list
	this.firstQuestion = _firstQuestion;
	// index of the last question in the question list
	this.lastQuestion = _lastQuestion;
}


QuestionBank.prototype.resetAnswerHistory = function() {
	for (var i = 0; i < this.denominator; i++) {
		this.answerHistory.push(null);
	}
}


/*
 * Add a new item to the back of the answer history, pull an item off
 * the front. Since the queue starts out filled with nulls, it is always
 * the same size.
 */
QuestionBank.prototype.updateAnswerHistory = function(newAnswer) {
	// add a new item to the back of the answer history
	this.answerHistory.push(newAnswer);
	// pull the oldest item off the front
	this.answerHistory.shift();
}


/*
 * Look at the answer history to see if we have met the criterion for
 * demonstrating mastery
 */
QuestionBank.prototype.masteryAchieved = function() {
	// count up the number of right answers
	var count = 0;
	// loop through the answer history
	for (var i = 0; i < this.answerHistory.length; i++) {
		// if we got the question right
		if (this.answerHistory[i]) {
			// increase our count
			count += 1;
		}
	}
	// compare the correct count to our goal
	return count >= this.numerator;
}


QuestionBank.prototype.checkAnswer = function(studentAnswer) {
	return true;
}


/*
 * Create a new set of question templateString
 */
QuestionBank.prototype.createNewQuestions = function() {
	// Each question template is an array holding either strings
  // or executable commands stored as strings.
  this.questions = [
 	 ["Fill in the adjacency matrix"],
 	 ["Fill in the adjacency list"],
  ];
  // the question index is used to rotate through the questions
  this.questionIndex = 0;
	// the answer(s) is/are stored in an array
	this.answers = [];
	// the actual question is stored in a string
	this.question = '';
}


/*
 * choose a random template and useit to construct a new question string
 */
QuestionBank.prototype.chooseQuestion = function() {
	// choose a question index at random
	this.questionIndex = getRandomInt(this.firstQuestion, this.lastQuestion + 1);
	// get the corresponding question template
	var questionTemplate = this.questions[this.questionIndex];
	// start with an empty question string
	this.question = "";
	// loop through every line of the template
	for (index = 0; index < questionTemplate.length; index++) {
		// get the next line of the template
		var templateString = questionTemplate[index];
		// add it to the question string
		this.question = this.question + templateString;
	}
}
