
var conway = function(canvasId) {
  var context, running, canvas, board, cellWidth, 
      cellHeight, cellX, cellY, lastUpdate;
  var cells = 25;

  var draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard();
    var now = new Date().getTime();
    if (running && ((now - lastUpdate) > 1000)) {
      board = simulate();
      lastUpdate = now;
    }
    drawGrid();
  };
  
  var clickHandler = function(e) {
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
  };

  var keyHandler = function(e) {
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
    }
  };

  var drawGrid = function() {
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
  
  var makeBoard = function() {
    var newBoard = new Array();
    for (i = -1; i <= cells; i++) {
      newBoard[i] = new Array();
      for (j = -1; j <= cells; j++) {
        newBoard[i][j] = false;
      }
    }
    return newBoard;
  }

  var countNeighbors = function(x, y) {
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

  var simulate = function() {
    var newBoard = makeBoard();
    
    for (i = 0; i < cells; i++) {
    	for (j = 0; j < cells; j++) {
    	  var neighbors = countNeighbors(i, j);
    	  if (board[i][j]) {
    	    newBoard[i][j] = (neighbors == 2 || neighbors == 3);
    	  } else {
    	    newBoard[i][j] = (neighbors == 3);
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
  
  var drawBoard = function() {
    for (i = 0; i < cells; i++) {
      for (j = 0; j < cells; j++) {
        if (board[i][j]) {
          fillCell(i, j);
        }
      }
    }
  }

  var circle = function(cellX, cellY) {
    var radius = cellWidth / 2;
    var centerX = cellX * cellWidth + radius;
    var centerY = cellY * cellHeight + radius;
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }
  
  var square = function(cellX, cellY) {
    ctx.fillRect(cellX * cellWidth, cellY * cellHeight, cellWidth, cellHeight);
  }
  
  var fillCell = function(cellX, cellY) {
    ctx.fillStyle = "#FF0000";
    circle(cellX, cellY);
  }
    
  lastUpdate = new Date().getTime();
  canvas = document.getElementById(canvasId);
  cellWidth = canvas.width / cells;
  cellHeight = canvas.height / cells;
  ctx = canvas.getContext('2d');
  
  board = makeBoard();
  running = false;
  document.onkeypress = keyHandler;
  canvas.onclick = clickHandler;
  
  return setInterval(draw, 100);
};
