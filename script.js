/*
const gameBoard = () => {
    player = 1;
    const n = 3; // 3x3 grid
    let gameBoard = Array.from({length: 9}, (_, i) => i + 1)
    // Get gameboard buttons
    gridItems = document.getElementsByClassName('grid-item');


    // get current board
    const getBoard = () => gameBoard;

    

    const playerClicked = (player,gameBoard,gridItems,gridItem) => {
        const marker = document.createElement('p');
        if (player == 1){
            gameBoard[gridItem-1] = 'X';
            marker.innerText = 'X';
            gridItems[gridItem-1].append(marker);
            player = 2;
        }
        else{
            gameBoard[gridItem-1] = 'O'
            marker.innerText = 'O';
            gridItems[gridItem-1].append(marker);
            player = 1;
        }
        return {player};
    }
    console.log(player);
    const gridButtons = (() => {
        
        for (i = 0;i < gridItems.length; i ++){
            gridItems[i].addEventListener('click',(e)=>{
                const player1 = document.getElementById('player1');
                player1.classList.add('active');
                gridItem = e.target.getAttribute('data-index');
                console.log(player);
                playerClicked(player,gameBoard,gridItems,gridItem);
            })
        }
    })();
}
gameBoard()
*/

const GameBoard = () => {
    n = 3;
    const board = [];

    for (let i = 0; i < n*n; i++) {
        board[i] = Cell();
      }
      
      const resetBoard = (player) => {
        for (let i = 0; i < n*n; i++) {
            board[i] = Cell();
         }
         return {board,player};
      }
      const getGameBoard = () => board;

      const drawTurn = (player,cell) => {
        // check available cells
        if (board[cell].getValue() !== '') {
            return;
        }
        board[cell].addMarker(player);
      }
      const checkValidMove = (cell) => {
        const currentBoard = board.map(cell => cell.getValue());
        if (currentBoard[cell] !== ''){
            return false;
        }
        return true;
      }
      const checkWinningBoard = () => {
        const currentBoard = board.map(cell => cell.getValue());
        if (//vertical
        currentBoard[0] == currentBoard[3] && currentBoard[0] == currentBoard[6] && currentBoard[0] !== '' ||
        currentBoard[1] == currentBoard[4] && currentBoard[1] == currentBoard[7] && currentBoard[1] !== ''||
        currentBoard[2] == currentBoard[5] && currentBoard[2] == currentBoard[8] && currentBoard[2] !== ''||
        //horizontal
        currentBoard[0] == currentBoard[1] && currentBoard[0] == currentBoard[2] && currentBoard[0] !== ''||
        currentBoard[3] == currentBoard[4] && currentBoard[3] == currentBoard[5] && currentBoard[3] !== ''||
        currentBoard[6] == currentBoard[7] && currentBoard[6] == currentBoard[8] && currentBoard[6] !== ''||
        //diagonal
        currentBoard[0] == currentBoard[4] && currentBoard[0] == currentBoard[8] && currentBoard[0] !== ''||
        currentBoard[2] == currentBoard[4] && currentBoard[2] == currentBoard[6] && currentBoard[2] !== ''
        ){  
            return true;
        };
        return false;

      }
      const printGameBoard = () => {
        const currentBoard = board.map(cell => cell.getValue());
        console.log(currentBoard);
      }
      return {getGameBoard,drawTurn,printGameBoard,checkValidMove,resetBoard,checkWinningBoard}
    }

// Create the cell
const Cell = () => {
    let value = '';
  
    // Accept a player's token to change the value of the cell
    const addMarker = (player) => {
        value = player.value;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addMarker,
      getValue
    };
  }
// Controls game flow
const GameController = (player1Name = "Player 1",player2Name = "Player 2") => {
    // Initialize the board
    board = GameBoard(); 
    
    const players =  [
        {
            name: player1Name,
            value: 'X'
        },
        {
            name: player2Name,
            value:'O'
        }
    ]
    let activePlayer = players[0]
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };
    const getActivePlayer = () => activePlayer;
    const checkWinner = () => {
        if (board.checkWinningBoard() === true){
            switchPlayerTurn(); // since play round will switch
            return getActivePlayer()
        }
        return false;
    }
    const playRound = (cell) => {
        if (board.checkValidMove(cell) === true){
            board.drawTurn(getActivePlayer(),cell);
            switchPlayerTurn();
            board.printGameBoard();
            
        };
        
    }
    const resetRound = () => {
        activePlayer = players[0]
        board.resetBoard();
    }
    return {switchPlayerTurn,getActivePlayer,playRound,getGameBoard: board.getGameBoard,resetRound,checkWinner}   
}

const ScreenController = () => {
    // start a new game
    const game = GameController();
    const boardDiv = document.querySelector('.gameBoard');
    const reset = document.getElementById('reset');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const activePlayer = game.getActivePlayer();
    // render the game board
    const updateScreen = () => {
        // Handle players
        const activePlayer = game.getActivePlayer();
        if (activePlayer.value === 'X'){
            player1.classList.add('active');
            player2.classList.remove('active');
        }
        else{
            player2.classList.add('active');
            player1.classList.remove('active');
        }
        renderBoard = game.getGameBoard();
        //Reset board
        renderBoard.textContent = "";
        // Clear the screen
        while (boardDiv.firstChild) {
            boardDiv.removeChild(boardDiv.firstChild);
        }
        // Add board
        for (let i = 0;i < renderBoard.length;i++){
            const cellButton = document.createElement("button");
            cellButton.classList.add('grid-item');
            cellButton.dataset.index = i;
            cellButton.textContent = renderBoard[i].getValue();
            boardDiv.appendChild(cellButton);   
        }
    }
    const winScreen = () => {
        alert("WINNER")
    }
    const handleClick = (e) => {
        game.playRound(e.target.getAttribute('data-index'));
        updateScreen();
        winner = game.checkWinner();
        if (winner !== false){
            winScreen()
        }
    }
    const handleReset = () => {
        game.resetRound();
        updateScreen();
    }
    boardDiv.addEventListener('click',handleClick);
    reset.addEventListener('click',handleReset);
    // initial render
    updateScreen();
    
        
}
ScreenController();