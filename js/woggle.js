
var timerCount = 90;

window.onload = initPage;

var isCountDownComplete = false;
var frequencyTable = new Array(
		"a","a","a","a","a","a","a","a","b","c","c","c","d","d","d",
		"e","e","e","e","e","e","e","e","e","e","e","e","f","f","g",
		"g","h","h","h","h","h","h","i","i","i","i","i","i","i","j",
		"k","l","l","l","l","m","m","n","n","n","n","n","n","o","o",
		"o","o","o","o","o","o","p","p","q","q","q","q","q","q","r",
		"r","r","r","r","r","s","s","s","s","s","s","s","s","t","t",
		"t","u","u","v","v","w","x","y","y","z");



function initPage(){
	randomizeTiles();
	disableWrapper();
	attachEventToStart();
	updateTimerTimeInRules();
}

function randomizeTiles(){

	var tiles = document.getElementById('letterbox').getElementsByTagName('a');

	for(var i=0; i<tiles.length; i++){
		var index = Math.floor(Math.random() * 100);
		var letter = frequencyTable[index];
		tiles[i].className = tiles[i].className + ' l' + letter;
		addEventHandler(tiles[i], "click", addLetter);
	}
}

function updateTimerTimeInRules() {
	var timerElementValue = document.getElementById('li6').firstChild.nodeValue;
	var timerElementArray = timerElementValue.split(" ");
	timerElementArray[4] = timerCount;
	timerElementString = timerElementArray.toString();
	var timerElementNewValue = timerElementString.replace(/,/g, " ");
	document.getElementById('li6').firstChild.nodeValue = timerElementNewValue;
	
}

function addLetter(){

	//Determine which letter was clicked
	var tileLetter = this.className.substring(10,11);
	
	//Add that word to current word box
	var currentWordDiv = document.getElementById('currentWord');
	var p = document.createElement('p');
	var currentWordChildNodes = currentWordDiv.childNodes;		//Get all the child nodes of currentWord div element
	if(currentWordChildNodes.length == 0){						//If currentWord div element does not have children nodes, add one
		currentWordDiv.appendChild(p);
		var currentWordText = document.createTextNode(tileLetter);
		p.appendChild(currentWordText);

		//Code for words submission
		var submitDiv = document.getElementById('submit');
		var a = submitDiv.firstElementChild;
		addEventHandler(a, "click", submitWord);
	}
	else{														//else append text to the current text element
		var p = currentWordDiv.firstChild;
		var letterText = p.firstChild;
		letterText.nodeValue += tileLetter;
	}

	//Disable the clicked tile
	this.className += ' disabled';
	removeEventHandler(this, "click", addLetter);				//removed onclick event handler
}

function submitWord(){
	request = createRequest();
	if(request == null) {
		alert('Unable to create request');
		return;
	}

	var currentWordDiv = document.getElementById('currentWord');
	var userWord = currentWordDiv.firstChild.firstChild.nodeValue;

	//Checking duplicate word
	if(isDuplicateWord()) {
		var currentWordP = currentWordDiv.firstChild;
		currentWordDiv.removeChild(currentWordP);
		return;
	}

	//Preparing to talk with the server
	var url = "../php/dictionary.php?word=" + escape(userWord);
	request.open("GET", url, false);									//Synchronous request
	request.send(null);

	if (parseInt(request.responseText) == -1){
		alert('You entered an invalid word. Try Again!');

		//Removing word from current word box
		var currentWordP = currentWordDiv.firstChild;
		currentWordDiv.removeChild(currentWordP);

		enableAllTiles();
		return;
	}
	
	else {
		//Adding accepted word to the wordList div
		var wordListDiv = document.getElementById('wordList');
		var p = document.createElement('p');
		wordListDiv.appendChild(p);
		var acceptedWord = document.createTextNode(escape(userWord));
		p.appendChild(acceptedWord);

		//Upadating the score
		var scoreDiv = document.getElementById('score');
		var scoreNode = scoreDiv.firstChild;
		var scoreText = scoreNode.nodeValue;
		var scorePieces = scoreText.split(" ");
		var currentScore = parseInt(scorePieces[1]);
		currentScore += parseInt(request.responseText);
		scoreNode.nodeValue = "Score: " + currentScore;

		//Replacing diabled tiles with the random ones
		replaceDisabledWithRandom();
	}


	//Removing word from current word box
	var currentWordP = currentWordDiv.firstChild;
	currentWordDiv.removeChild(currentWordP);

	enableAllTiles();

	var submitDiv = document.getElementById('submit');
	var a = submitDiv.firstElementChild;
	a.onclick = function() {
		alert('Please click tiles to add letters and create a word.');
	}
}

function enableAllTiles(){
	var tiles = document.getElementById('letterbox').getElementsByTagName('a');

	for (var i=0; i<tiles.length; i++){
		var tileClasses = tiles[i].className.split(" ");
		if (tileClasses.length == 4){
			newClass = tileClasses[0] + " " + tileClasses[1] + " " + tileClasses[2];
			tiles[i].className = newClass;
			addEventHandler(tiles[i], "click", addLetter);
		}
	}
}

function replaceDisabledWithRandom() {
	var tiles = document.getElementById('letterbox').getElementsByTagName('a');

	for(var i=0; i<tiles.length; i++){
		var index = Math.floor(Math.random() * 100);
		var letter = frequencyTable[index];
		var tileClasses = tiles[i].className.split(" ");
		if(tileClasses.length == 4){
			newClass = tileClasses[0] + " " + tileClasses[1] + " l" + letter;
			tiles[i].className = newClass;
			addEventHandler(tiles[i], "click", addLetter);
		}
	}
}

function isDuplicateWord() {
	var currentWordDiv = document.getElementById('currentWord');
	var userWord = currentWordDiv.firstChild.firstChild.nodeValue;
	var isDuplicate = false;
	//Checking duplicate word
	var wordListDivP = document.getElementById('wordList').getElementsByTagName('p');
	for(var i=0; i<wordListDivP.length; i++){
		if(userWord == wordListDivP[i].firstChild.nodeValue){
			alert('You have already used that word. Try different one');
			enableAllTiles();
			isDuplicate = true;
			break;
		}
	}

	if(isDuplicate == true) {
		return true;
	}
	else {
		return false;
	}
}

function disableWrapper() {
	document.getElementById('wrapper').className = "wrapperDisabled";
		
	//Diabling submit button
	var submitDiv = document.getElementById('submit');
	var a = submitDiv.firstElementChild;
	removeEventHandler(a, "click", submitWord);

	//Disabling tiles
	var tiles = document.getElementById('letterbox').getElementsByTagName('a');

	for(var i=0; i<tiles.length; i++){
		removeEventHandler(tiles[i], "click", addLetter);
	}

}

function enableWrapper() {
	document.getElementById('wrapper').className = "wrapper";
		
	//Enabling submit button
	var submitDiv = document.getElementById('submit');
	var a = submitDiv.firstElementChild;
	addEventHandler(a, "click", submitWord);

	//Enabling tiles
	var tiles = document.getElementById('letterbox').getElementsByTagName('a');

	for(var i=0; i<tiles.length; i++){
		addEventHandler(tiles[i], "click", addLetter);
	}
}

function attachEventToStart(){
	var startGameDiv = document.getElementById('startGame');
	addEventHandler(startGameDiv, "click", startGame);
}

function startGame() {
	detachEventFromStart();
	enableWrapper();
	createTimerElement();
	startCountdown();
	var timerCountDown = timerCount + 2;
	timerCountDown = timerCountDown * 1000;
	setTimeout('resetAll()', timerCountDown);
}


function detachEventFromStart(){
	var startGameDiv = document.getElementById('startGame');
	removeEventHandler(startGameDiv, "click", startGame);
	startGameDiv.firstElementChild.className = "disabled";
}

function createTimerElement(){
	var backgroundDiv = document.getElementById('background');
	var divElement = document.createElement('div');
	var idAttribute = document.createAttribute('id');
	idAttribute.value = "timer";
	divElement.setAttributeNode(idAttribute);
	backgroundDiv.appendChild(divElement);
}

function startCountdown() {
	if (timerCount > 0){
		var timerDiv = document.getElementById('timer');
		var timerText = document.createTextNode(timerCount + " sec remaining");
		timerDiv.appendChild(timerText);
		var replaceCount = setTimeout(function() {timerDiv.removeChild(timerText)}, 1000);
		if (timerCount > 0){
			countdown = setTimeout('startCountdown()', 1000);
		}
	}
	if (timerCount == -1) {
		//var isCountDownOver = true;
		clearTimeout(countdown);
		clearTimeout(replaceCount);
	}

	timerCount--;
}

function resetAll() {
	var scoreDiv = document.getElementById('score');
	var scoreNode = scoreDiv.firstChild;
	var scoreText = scoreNode.nodeValue;
	var scorePieces = scoreText.split(" ");
	var currentScore = parseInt(scorePieces[1]);
	alert("Your final score is: " + currentScore) ;
	location.reload(true);
}