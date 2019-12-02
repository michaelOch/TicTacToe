//  Module for Gameboard
const GameBoard = (() => {
    const cells = [];

    const setCell = (index, symbol) => {
        cells[index] = symbol;
    }

    const _getCell = (index) => {
        return cells[index];
    }

    const isCellsFull = () => {
        let isFull = true;
        for(let i = 0; i < 9; i++) {
            if(cells[i] === undefined) {
                isFull = false;
                break;
            }
        }
    
        return isFull;
    }

    const checkRowColDiag = () => {
        const cell0 = _getCell(0);
        const cell1 = _getCell(1);
        const cell2 = _getCell(2);
        const cell3 = _getCell(3);
        const cell4 = _getCell(4);
        const cell5 = _getCell(5);
        const cell6 = _getCell(6);
        const cell7 = _getCell(7);
        const cell8 = _getCell(8);
        if(cell0 === cell1 && cell0 === cell2) {
            return cell0;
        } else if(cell3 === cell4 && cell3 === cell5) {
            return cell3;
        } else if(cell6 === cell7 && cell6 === cell8) {
            return cell6;
        } else if(cell0 === cell3 && cell0 === cell6) {
            return cell0;
        } else if(cell1 === cell4 && cell1 === cell7) {
            return cell1;
        } else if(cell2 === cell5 && cell2 === cell8) {
            return cell2;
        } else if(cell0 === cell4 && cell0 === cell8) {
            return cell0;
        } else if(cell2 === cell4 && cell2 === cell6) {
            return cell2;
        } else {
            return '';
        }
    }
    
    return {
        cells,
        setCell,
        isCellsFull,
        checkRowColDiag
    }
})();

//  Factory Function to create players
const Player = (name, symbol) => {
    const playerName = () => name;
    const playerSymbol = () => symbol;
    return {
        playerName,
        playerSymbol
    }
};

//  UI Module
const DisplayController = (() => {
    const DOM = {
        gameUI: document.querySelector('.card-body'),
        playerOne: document.querySelector('#playerOne'),
        playerTwo: document.querySelector('#playerTwo'),
        message: document.querySelector('#congrats-msg'),
        messageContainer: document.querySelector('.congrats-wrapper'),
        cells: document.querySelectorAll('.col-md-4')
    }

    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.classList.add('btn-success');
    restartBtn.classList.add('btn-block');
    restartBtn.textContent = 'Restart';

    const displayTag = e => {
        if(e.target.classList.contains('col-md-4')) {
            if(e.target.children.length === 0) {
                const tag = document.createElement('h1');
                tag.className = 'text-center';
                if(Game.getPlayerTurn() === Init.firstPlayer.playerName()) {
                    tag.classList.add('text-success');
                    tag.textContent = Init.firstPlayer.playerSymbol();
                    GameBoard.setCell(e.target.getAttribute('data-index'), Init.firstPlayer.playerSymbol());
                } else {
                    tag.classList.add('text-danger');
                    tag.textContent = Init.secondPlayer.playerSymbol();
                    GameBoard.setCell(e.target.getAttribute('data-index'), Init.secondPlayer.playerSymbol());
                }
                e.target.appendChild(tag);
            }

            let symbol;
            if(GameBoard.checkRowColDiag()) {
                symbol = GameBoard.checkRowColDiag();
                if(symbol === Init.firstPlayer.playerSymbol()) {
                    DOM.message.textContent = `Player One Wins!`;
                    DOM.messageContainer.appendChild(restartBtn);
                } else {
                    DOM.message.textContent = `Player Two Wins!`;
                    DOM.messageContainer.appendChild(restartBtn);
                }
            }

            if(GameBoard.isCellsFull()) {
                DOM.message.textContent = `It's a Tie!`;
                DOM.messageContainer.appendChild(restartBtn);
            } else {
                // Game.changePlayerTurn();
                if(Game.changePlayerTurn() === Init.firstPlayer.playerName()) {
                    DOM.playerTwo.classList.remove('active');
                    DOM.playerOne.classList.add('active');
                } else {
                    DOM.playerOne.classList.remove('active');
                    DOM.playerTwo.classList.add('active');
                }
            }

        }

        if(e.target.classList.contains('btn-success')) {
            DOM.cells.forEach(cell => {
                cell.innerHTML = '';
            });
            e.target.parentNode.removeChild(restartBtn);
            DOM.message.textContent = '';
            GameBoard.cells.splice(0, 9);
            DOM.playerOne.classList.add('active');
            DOM.playerTwo.classList.remove('active');
            Game.setPlayerTurn(Init.firstPlayer.playerName());
        }
    }

    DOM.gameUI.addEventListener('click', displayTag);
})();

const Init = (() => {
    //  Initialize the player details
    const firstPlayer = Player('Mike', 'X');
    const secondPlayer = Player('Joel', 'O');

    //  Declare the player turn variable and initialize it to first player
    let playerTurn = firstPlayer.playerName();

    return {
        firstPlayer,
        secondPlayer,
        playerTurn
    }
})();

const Game = (() => {
    let playerTurn = Init.playerTurn;

    const setPlayerTurn = (pTurn) => {
        playerTurn = pTurn;
    }

    const getPlayerTurn = () => {
        return playerTurn;
    }

    const changePlayerTurn = () => {
        playerTurn = (playerTurn === Init.firstPlayer.playerName()) ? Init.secondPlayer.playerName() : Init.firstPlayer.playerName();
        return playerTurn;
    }

    return {
        setPlayerTurn,
        getPlayerTurn,
        changePlayerTurn
    }
})();