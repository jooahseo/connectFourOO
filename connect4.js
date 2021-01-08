/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Player{
  constructor(color){
    this.color = color;
  }
}
class Game{
  constructor(height, width, player1, player2){
    this.width = width;
    this.height = height;
    this.player1 = player1
    this.player2 = player2;
    this.currPlayer = this.player1;
    this.board = [];
    this.gameEnd = false;
    this.makeBoard();
    this.makeHtmlBoard();
    document.querySelector("#start").addEventListener('click', this.startGame.bind(this));
    
  }
  startGame(){
    this.gameEnd = false;
    this.board.splice(0, this.board.length);
    const htmlBoard = document.querySelector('#board');
    htmlBoard.innerHTML ="";
    
    this.player1 = new Player(document.querySelector("#p1").value);
    this.player2 = new Player(document.querySelector("#p2").value);
    this.currPlayer = this.player1;

    this.makeBoard();
    this.makeHtmlBoard();
  }
  makeBoard(){
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard(){
    const HtmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    HtmlBoard.append(top);
  
    // make main part of HtmlBoard
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      HtmlBoard.append(row);
    }
  }
  handleClick(evt) { /** handleClick: handle click of column top to play piece */
    if(this.gameEnd){return;}
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }
  findSpotForCol(x) { /** findSpotForCol: given column x, return top empty y (null if filled) */
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) { /** placeInTable: update DOM to place piece into HTML table of board */
    const piece = document.createElement('div');

    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    this.gameEnd=true;
    alert(msg);
  }

  checkForWin() { /** checkForWin: check board cell-by-cell for "does a win start here?" */
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}


document.querySelector("#start").addEventListener('click', ()=>{
  const player1 = new Player(document.querySelector("#p1").value);
  const player2 = new Player(document.querySelector("#p2").value);
  new Game(6,7,player1, player2)
});
