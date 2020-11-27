const Gameboard = (() => {
    // cache
    const gameboard = [ 
        ["","",""],
        ["","",""],
        ["","",""]
    ];
    const gridSize = 3;

    // functions

    const playTurn = (row, column, turn) => {
        if (gameboard[row][column] === "") gameboard[row][column] = turn;
        return gameboard[row][column];
    }

    const clearGameboard = () => {
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
            gameboard[row][column] = "";
    }

    const reset = () => clearGameboard();

    const isEmpty = () => {
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
                if (gameboard[row][column] !== "") return false;
        return true;
    }

    const isFull = () => {
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
                if (gameboard[row][column] === "") return false;
        return true;
    }


    const getGridSize = () => gridSize;

    const getCellInput = (row, column) => gameboard[row][column];

    const getColumn = (column) => {
        const colArr = [];
        for (let row = 0; row < gridSize; row++){
            colArr.push(gameboard[row][column]);
        }
        return colArr;
    }

    const getRow = (row) => gameboard[row];

    const getDiagonalTLBR = () => {
        const arr = [];
        for (let row = 0, column = 0; row < gridSize, column < gridSize; row++, column++)
                arr.push(gameboard[row][column]);
        return arr;
    }

    const getDiagonalBLTR = () => {
        const arr = [];
        for (let row = gridSize - 1, column = 0; row >= 0, column < gridSize; row--, column++)
                arr.push(gameboard[row][column]);
        return arr;
    }

    const getBoard = () => gameboard;

    return {reset, isEmpty, isFull, playTurn, getGridSize, getCellInput, getColumn, getRow, getDiagonalTLBR, getDiagonalBLTR, getBoard};

})();



const TurnHandler = (() => {
    // cache
    const symbol1 = "X";
    const symbol2 = "O";

    let turn = symbol1;

    // functions

    const playTurn = () => {
        const temp = turn;
        turn = turn === symbol1 ? symbol2 : symbol1;
        return temp;
    }

    const getCurrentTurnSymbol = () => turn;

    const getSymbol1 = () => symbol1;

    const getSymbol2 = () => symbol2;

    const changeFirstTurn = () => {
        if (Gameboard.isEmpty()) turn = turn === symbol1 ? symbol2 : symbol1;
    }

    const getPlayerNameFromSymbol = (symbol) => {
        return symbol === player1.getSymbol() ? player1.getName() : player2.getName();
    }

    const getCurrentTurn = () => getPlayerNameFromSymbol(turn)


    return {playTurn, getCurrentTurnSymbol, getSymbol1, getSymbol2, changeFirstTurn, getCurrentTurn, getPlayerNameFromSymbol};
})();

const Player = (name, symbol) => {
    const id = name.replace(/\s/g, '').toLowerCase();
    const setName = (newName) => name = newName;
    let wins = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getWins = () => wins;
    const addWin = () => wins++;
    const getID = () => id;
    const getquerySelector = () => `#${id}-info`

    const resetWins = () => wins = 0;

    return {setName, getName, getSymbol, getWins, addWin, getID, getquerySelector, resetWins};
};

const player1 = Player("Player 1", TurnHandler.getSymbol1());
const player2 = Player("Player 2", TurnHandler.getSymbol2());

const players = [player1, player2];

const handleGame = (() => {
    const isVerticalWin = () => {
        if (Gameboard.isEmpty()) return false;
        for (let column = 0; column < Gameboard.getGridSize(); column++)
            if(Gameboard.getColumn(column).every((value, index, arr) => value === arr[0] &&  value !== "")) return true;
        return false;
    };


    const isHorizontalWin = () => {
        if (Gameboard.isEmpty()) return false;
        for (let row = 0; row < Gameboard.getGridSize(); row++)
            if(Gameboard.getRow(row).every((value, index, arr) => value === arr[0] && value !== "")) return true;
        return false;
    };

    const isDiagonalWin = () => {
        if (Gameboard.isEmpty()) return false;
        if(Gameboard.getDiagonalBLTR().every((value, index, arr) => value === arr[0] && value !== "")) return true;
        if(Gameboard.getDiagonalTLBR().every((value, index, arr) => value === arr[0] && value !== "")) return true;
        return false;
    };

    const isWinner = () => {
        return isVerticalWin() || isHorizontalWin() || isDiagonalWin();
    }

    const isOver = () => Gameboard.isFull() || isWinner() ? true : false;

    const isDraw = () => !isOver() || isWinner() ? false : true;

    const getWinnerSymbol = () => {
        if (isWinner())
            return TurnHandler.getCurrentTurnSymbol() === TurnHandler.getSymbol1() ? TurnHandler.getSymbol2() : TurnHandler.getSymbol1();
    }

    const getWinner = () => TurnHandler.getPlayerNameFromSymbol(getWinnerSymbol());

    return {isOver, isWinner, isDraw, isDiagonalWin, isHorizontalWin, isVerticalWin, getWinner};
})();


const ScoreTracker = (() => {
    let draws = 0;
    let gamesPlayed = 0;

    const addWin = (player) => {
        if (player === player1.getName()) player1.addWin();
        else player2.addWin();
    }

    const addDraw = () => {
        draws++;
    }

    const addResult = () => {
        if (handleGame.isOver()){
            if (handleGame.isWinner()){
                addWin(handleGame.getWinner());
            }
            else addDraw();
            gamesPlayed++;
        }
    }

    const getPlayer1Wins = () => player1.getWins()

    const getPlayer2Wins = () => player2.getWins()

    const getDraws = () => draws;

    const getGamesPlayed = () => gamesPlayed;

    const resetScores = () => {
        player1.resetWins();
        player2.resetWins();
        draws = 0;
        gamesPlayed = 0;
    }

    return {addResult, getPlayer1Wins, getPlayer2Wins, getDraws, getGamesPlayed, resetScores, addWin}

})();

const MessageController = ((doc) => {
    const message = doc.querySelector("#message");

    const winnerMessage = () => {
        const winningPlayer = handleGame.getWinner();
        ScoreTracker.addWin(winningPlayer);
        message.innerText = `${winningPlayer} wins!`;
    };
    
    const drawMessage = () => {
        message.innerText = `Draw!`;
    };

    const turnMessage = () => {
        playerTurn = TurnHandler.getCurrentTurn();
        message.innerText = `${playerTurn}'s turn!`;
    };

    const render = () => {
        if (handleGame.isWinner()) winnerMessage();
        else if (handleGame.isDraw()) drawMessage();
        else turnMessage();
    };
    
    return {render};
})(document);

const InfoController = ((doc) => {
    const info = doc.querySelector("#info");

    const playerInfo = {
        player1 : doc.querySelector(player1.getquerySelector()),
        player2 : doc.querySelector(player2.getquerySelector())
    };


    const addPlayer = (player) => {
            playerInfo[player.getID()].innerText = `${player.getName()} - ${player.getSymbol()} - ${player.getWins()}`;
        
    };

    const addPlayer2 = () => {
        player2Info.innerText = `${player2.getName()} - ${player2.getSymbol()}`;
    };
    
    const addDraws = () => {
        // add draws
    }

    const render = () => {
        addPlayer(player1);
        addPlayer(player2);
    };
    
    return {render};
})(document);

const BoardController = ((doc) => {
    const htmlBoard = doc.querySelector("#board");

    // EventHandlers
    const addCell = (htmlBoard, row, column) => {
        const cell = doc.createElement("div");
        
        const entry = Gameboard.getCellInput(row, column);

        cell.dataset.row = row;
        cell.dataset.column = column;
        cell.classList = "cell";
        cell.innerText = entry;
        if (entry === "" && !handleGame.isOver()) {
            cell.addEventListener("click", playTurn);
            cell.addEventListener("mouseover", hoverCell);
            cell.addEventListener("mouseout", hoverCell);
        }

        htmlBoard.appendChild(cell);
    }

    const playTurn = (e) => {
        const cell = e.target;
        const row = cell.dataset.row;
        const column = cell.dataset.column;
        
        cell.dataset.entry = Gameboard.playTurn(row, column, TurnHandler.playTurn());
        render();
    }

    const hoverCell = (e) => {
        const cell = e.target;
        const currentTurn = TurnHandler.getCurrentTurnSymbol();

        if (cell.innerText === "" ){
            cell.innerText = currentTurn;
            cell.classList.add("temp-input");
        }
        else {
            cell.innerText = "";
            cell.classList.remove("temp-input");
        }
    }

    // render

    const render = () => {
        clearGameboardHtml();
        displayGameboardHtml();
        MessageController.render();
        InfoController.render();
    }

    const clearGameboardHtml = () => {
        while (htmlBoard.firstChild) htmlBoard.removeChild(htmlBoard.firstChild);
    }

    const displayGameboardHtml = () => {
        for (let row = 0; row < Gameboard.getGridSize(); row++)
            for (let column = 0; column < Gameboard.getGridSize(); column++)
                addCell(htmlBoard, row, column);
    }

    render();

    return {render}

})(document);

const ButtonsController = ((doc) => {
    const btns = doc.querySelector("#buttons");
    const resetGameBtn = doc.querySelector("#reset-game-btn");
    const resetScoreBtn = doc.querySelector("#reset-score-btn");

    const resetGame = (e) => {
        Gameboard.reset();
        BoardController.render();
    }

    const resetScore = (e) => {
        ScoreTracker.resetScores();
        InfoController.render();
    }

    resetGameBtn.addEventListener("click", resetGame);
    resetScoreBtn.addEventListener("click", resetScore);

})(document);
