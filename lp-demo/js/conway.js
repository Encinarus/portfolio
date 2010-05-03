
var CONWAY = {};

CONWAY.board = {
    cells: 20,
    board: new Array(),
};

CONWAY.init = function() {
  running = true;
  canvas = document.getElementById('conway');
  ctx = canvas.getContext('2d');
  board = makeBoard();
  board[3][3] = board[3][5] = 1;
  board[3][4] = 3;
  
  document.onkeypress = keyHandler;
  canvas.onclick = clickHandler;
  
  cellWidth = canvas.width / cells;
  cellHeight = canvas.height / cells;
  
  return setInterval(draw, 100);
};
var cells = 20;

var cellWidth;
var cellHeight;

var board;

var ctx;
function drawGrid() {
  ctx.strokeStyle = "#0000FF";
  ctx.beginPath(); 
  for (i = 1; i < cells; i++) {
    ctx.moveTo(cellWidth * i, 0);
    ctx.lineTo(cellWidth * i, canvas.height);
  }
  for (i = 1; i < cells; i++) {
    ctx.moveTo(0, cellHeight * i);
    ctx.lineTo(canvas.width, cellHeight * i);
  }
  ctx.closePath();
  ctx.stroke();
}

function makeBoard() {
  var newBoard = new Array();
  for (i = -1; i <= cells; i++) {
    newBoard[i] = new Array();
    for (j = -1; j <= cells; j++) {
      newBoard[i][j] = false;
    }
  }
  return newBoard;
}

function countNeighbors(x, y) {
  newCount = 0;
  // uses javascript's negative indexable array :) 
  if (board[x][y-1]) newCount++;
  if (board[x][y+1]) newCount++;
  if (board[x-1][y]) newCount++;
  if (board[x+1][y]) newCount++;
  if (board[x-1][y-1]) newCount++;
  if (board[x+1][y-1]) newCount++;
  if (board[x-1][y+1]) newCount++;
  if (board[x+1][y+1]) newCount++;
  return newCount;
}

function simulate() {
  var newBoard = makeBoard();
  
  for (i = 0; i < cells; i++) {
  	for (j = 0; j < cells; j++) {
  	  var neighbors = countNeighbors(i, j);
  	  if (board[i][j]) {
  	    newBoard[i][j] = survive(neighbors);
  	  } else {
  	    newBoard[i][j] = born(neighbors);
  	  }
  	}
  }
  
  // Now copy edge cells to make simulation wrap around
  for (i = -1; i <= cells; i++) {
    newBoard[i][-1] = newBoard[i][cells-1];
    newBoard[i][cells] = newBoard[i][-1];
    newBoard[-1][i] = newBoard[cells-1][i];
    newBoard[cells][i] = newBoard[-1][i];
  }

  return newBoard;
}

function survive(neighbors) {
  return neighbors == 2 || neighbors == 3;
}

function born(neighbors) {
  return neighbors == 3;
}

function drawBoard() {
  for (i = 0; i < cells; i++) {
    for (j = 0; j < cells; j++) {
      if (board[i][j]) {
        fillCell(i, j);
      }
    }
  }
}

function circle(cellX, cellY) {
  var radius = cellWidth / 2;
  var centerX = cellX * cellWidth + radius;
  var centerY = cellY * cellHeight + radius;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

function square(cellX, cellY) {
  ctx.fillRect(cellX * cellWidth, cellY * cellHeight, cellWidth, cellHeight);
}

function fillCell(cellX, cellY) {
  ctx.fillStyle = "#FF0000";
  circle(cellX, cellY);
//  square(cellX, cellY);
}

var running;
var board;
var canvas;
function init() {
  running = true;
  canvas = document.getElementById('conway');
  ctx = canvas.getContext('2d');
  board = makeBoard();
  board[3][3] = board[3][5] = 1;
  board[3][4] = 3;
  
  document.onkeypress = keyHandler;
  canvas.onclick = clickHandler;
  
  cellWidth = canvas.width / cells;
  cellHeight = canvas.height / cells;
  
  return setInterval(draw, 100);
}

function clickHandler(e) {
  var elementX = elementY = 0;
  var parent=e.currentTarget;
  while (parent) {
    elementX += parent.offsetLeft;
    elementY += parent.offsetTop;
    parent = parent.offsetParent;
  }

  var clickX = e.clientX + canvas.offsetParent.scrollLeft - elementX;
  var clickY = e.clientY + canvas.offsetParent.scrollTop - elementY; 
  
  var cellX = parseInt(clickX / cellWidth);
  var cellY = parseInt(clickY / cellHeight);
  
  board[cellX][cellY] = !board[cellX][cellY];
}

function keyHandler(e) {
  var keynum;
  var keychar;
  
  if (window.event) { // IE
    keynum = e.keyCode;
  } else if (e.which) {  // Others
    keynum = e.which;
  }
  
  keychar = String.fromCharCode(keynum);
  
  if (keychar == "s") {
    running = !running;
  } else if (keychar == "r") {
    board = makeBoard(); 
  } else if (keychar == "n") {
    board = simulate();
  } else if (keychar == "+") {
    grow();
  } else if (keychar == "-") {
    shrink();
  }
}

function grow() {
  canvas.width += cellWidth;
  canvas.height += cellHeight;
  cells += 1;
  var newBoard = makeBoard();
  for (i = 0; i < cells; i++) {
    for (j = 0; j < cells; j++) {
      newBoard[i][j] = board[i][j];
    }
  }
  board = newBoard;
  simulate();
}

function shrink() {
  canvas.width -= cellWidth;
  canvas.height -= cellHeight;
  cells -= 1;
  var newBoard = makeBoard();
  for (i = 0; i < cells; i++) {
    for (j = 0; j < cells; j++) {
      newBoard[i][j] = board[i][j];
    }
  }
  board = newBoard;
  simulate();
}

var cellX = 0;
var cellY = 0;
var lastUpdate = 0;
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoard();
  var now = new Date().getTime();
  if (running && ((now - lastUpdate) > 1000)) {
    board = simulate();
    lastUpdate = now;
  }
  drawGrid();
}
