window.onload = initPage;

function initPage(){
	var table = document.getElementById('puzzleGrid');
	var cells = document.getElementsByTagName('td');
	for(var i=0; i<cells.length; i++){
		var cell = cells[i];
		cell.onclick = tileClick;
	}
}

function isCellEmpty(activatedCell){
	var childImage = activatedCell.firstElementChild;
	if(childImage.alt == "empty"){
		return true;
	}
	else{
		return false;
	}
}

function tileClick(){
	if(isCellEmpty(this)){
		alert('Please select a numbered tile!');
		return;
	}

	var currentRow = this.id.charAt(4);
	var currentCol = this.id.charAt(5);

	//Following code checks 'above' the current cell clicked to determine if it is an empty cell
	if(currentRow > 1){
		var testRow = Number(currentRow) - 1;
		var testCellId = "cell" + testRow + currentCol;
		var testCell = document.getElementById(testCellId);
		if(isCellEmpty(testCell)){
			swapTiles(this,testCell);		//swap if found empty
			return;
		}
	}

	//Following code checks 'below' the current cell clicked to determine if it is an empty cell
	if(currentRow < 4){
		var testRow = Number(currentRow) + 1;
		var testCellId = "cell" + testRow + currentCol;
		var testCell = document.getElementById(testCellId);
		if(isCellEmpty(testCell)){
			swapTiles(this,testCell);		//swap if found empty
			return;
		}
	}

	//Following code checks 'to the left' of the current cell clicked to determine if it is an empty cell
	if(currentCol > 1){
		var testCol = Number(currentCol) - 1;
		var testCellId = "cell" + currentRow + testCol;
		var testCell = document.getElementById(testCellId);
		if(isCellEmpty(testCell)){
			swapTiles(this,testCell);
			return;
		}
	}

	//Following code checks 'to the left' of the current cell clicked to determine if it is an empty cell
	if(currentCol < 4){
		var testCol = Number(currentCol) + 1;
		var testCellId = "cell" + currentRow + testCol;
		var testCell = document.getElementById(testCellId);
		if(isCellEmpty(testCell)){
			swapTiles(this,testCell);
			return;
		}
	}

	//If a user tries to click a cell which is locked i.e. cell 'not' surrounded by an empty cell following alert is displayed
	alert('Please click a tile near an empty one!');
}


function swapTiles(selectedCell,destinationCell){
	selectedImage = selectedCell.firstElementChild;
	destinationImage = destinationCell.firstElementChild;
	selectedCell.appendChild(destinationImage);
	destinationCell.appendChild(selectedImage);

	if(ispuzzleComplete()){
		document.getElementById('logo').innerHTML = "We have a Winner!";
		document.getElementById('logo').className = "win";
		alert('Congratulations!');
	}
}

function ispuzzleComplete(){
	var tiles = document.getElementById('puzzleGrid').getElementsByTagName('img');
	var tileOrder = "";

	for(var i=0; i<tiles.length; i++){
		var num = tiles[i].src.substr(-6,2);
		if(num != "ty"){
			tileOrder += num;
		}
	}

	if(tileOrder == "010203040506070809101112131415") 
		return true;
	else 
		return false;
}