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

    const reset = () => {
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
            gameboard[row][column] = "";
    }

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

    const getNumberOfEmptyCells = () => {
        count = 0;
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
                if (gameboard[row][column] === "") count++;
        return count;
    }

    const getEmptyCells = () => {
        const arr = []
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
                if (gameboard[row][column] === "") arr.push([row, column]);
        return arr;
    }

    const isEmptyCell = (row, col) => gameboard[row][col] === "" ? true : false;

    const refreshBoardSymbols = (oldSymbol1, newSymbol1) => {
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < gridSize; column++)
                if (gameboard[row][column] === oldSymbol1) gameboard[row][column] = newSymbol1;
    }

    return {reset, isEmpty, isFull, playTurn, getGridSize, getCellInput, getColumn, getRow, getDiagonalTLBR, getDiagonalBLTR, getBoard, getNumberOfEmptyCells, getEmptyCells, isEmptyCell, refreshBoardSymbols};

})();


const Player = (name, symbol) => {
    const id = name.replace(/\s/g, '').toLowerCase();
    const setName = (newName) => name = newName;
    const setSymbol = (newSymbol) => symbol = newSymbol;
    let wins = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getWins = () => wins;
    const addWin = () => wins++;
    const getID = () => id;
    const getquerySelector = () => `#${id}-info`

    const resetWins = () => wins = 0;

    return {setName, getName, getSymbol, getWins, addWin, getID, getquerySelector, resetWins, setSymbol};
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const TurnHandler = (() => {
    // cache
    let symbol1 = player1.getSymbol();
    let symbol2 = player2.getSymbol();

    let turn = symbol1;

    // functions

    const playTurn = () => {
        const prevTurn = turn;
        turn = turn === symbol1 ? symbol2 : symbol1;
        return prevTurn;
    }

    const getCurrentTurnSymbol = () => turn;
    const getSymbol1 = () => symbol1;
    const getSymbol2 = () => symbol2;
    const changeTurn = () => turn = turn === symbol1 ? symbol2 : symbol1;

    const getPlayerNameFromSymbol = (symbol) => {
        return symbol === player1.getSymbol() ? player1.getName() : player2.getName();
    }

    const getCurrentTurn = () => getPlayerNameFromSymbol(turn)

    const refreshTurnSymbol = () => {
        if (turn === symbol1) turn = player1.getSymbol()
        else turn = player2.getSymbol();
    }

    const refreshSymbols = () => {
        refreshTurnSymbol();
        symbol1 = player1.getSymbol();
        symbol2 = player2.getSymbol();
    }

    return {playTurn, getCurrentTurnSymbol, getSymbol1, getSymbol2, changeTurn, getCurrentTurn, getPlayerNameFromSymbol, refreshSymbols};
})();


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

    const isWinningEntry = (row, col) => {
        if (!isWinner()) return false;
        if(Gameboard.getColumn(col).every((value, index, arr) => value === arr[0] &&  value !== "")) return true;
        if(Gameboard.getRow(row).every((value, index, arr) => value === arr[0] && value !== "")) return true;
        if (row === 1 && col === 1) {
            if (isDiagonalWin()) return true;
        }
        if ((row === 0 && col === 0) || (row === 2 && col === 2)){ 
            if(Gameboard.getDiagonalTLBR().every((value, index, arr) => value === arr[0] && value !== "")) return true;
        }
        if ((row === 0 && col === 2) || (row === 2 && col === 0)){
            if(Gameboard.getDiagonalBLTR().every((value, index, arr) => value === arr[0] && value !== "")) return true;
        }
        return false;
    }

    return {isOver, isWinner, isDraw, isDiagonalWin, isHorizontalWin, isVerticalWin, getWinner, isWinningEntry, getWinnerSymbol};
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
            } else addDraw();
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

const FinalMessageController = ((doc) => {
    const finalMessage = doc.querySelector("#final-message")

    const winnerMessageDisplay = () => {
        const winningPlayer = handleGame.getWinner();
        const winningPlayerSymbol = handleGame.getWinnerSymbol()
        finalMessage.innerText = `${winningPlayer} (${winningPlayerSymbol}) wins!`;
    };
    
    const drawMessageDisplay = () => finalMessage.innerText = `Draw!`;
    const noFinalMessageDisplay = () => finalMessage.innerText = ``;

    const render = () => {
        if (handleGame.isWinner()) winnerMessageDisplay();
        else if (handleGame.isDraw()) drawMessageDisplay();
        else noFinalMessageDisplay();
    }
    
    return {render};
})(document);

const TurnMessageController = ((doc) => {
    const turnMessage = doc.querySelector("#turn-message")
    
    const render = () => {
        const playerTurnSymbol = TurnHandler.getCurrentTurnSymbol();
        const playerTurn = TurnHandler.getCurrentTurn();
        turnMessage.innerText = `${playerTurn}'s (${playerTurnSymbol}) turn next!`;
    };
    
    return {render};
})(document);


const MessageController = (() => {
    const render = () => {
        FinalMessageController.render()
        TurnMessageController.render();
    };
    
    return {render};
})();

const PlayerInfoNameControlloer = ((doc) => {
    const playerInfoDivs = {
        player1 : doc.querySelector(player1.getquerySelector()),
        player2 : doc.querySelector(player2.getquerySelector())
    };

    const changePlayerName = (e) => {
        e.preventDefault();
        const newName = e.target.querySelector("input").value;
        const playerIDElement = e.target.parentElement.parentElement.id
        const playerID = playerIDElement.substring(0, playerIDElement.indexOf("-"));
        
        if (playerID === player1.getID()) player1.setName(newName);
        else player2.setName(newName);
        
        reRender();
    }

    const editNameForm = (e) => {
        const editIcon = e.target;
        editIcon.removeEventListener("click", editNameForm);
        const nameDiv = editIcon.parentElement.parentElement.getElementsByClassName("name")[0];
        nameDiv.innerText = "";
        const playerNameForm = doc.createElement("form");
        playerNameForm.addEventListener("submit", changePlayerName)

        const formInput = doc.createElement("input");

        playerNameForm.appendChild(formInput);
        nameDiv.appendChild(playerNameForm);
    }

    const addPlayer = (player) => {
        const playerInfoDiv = playerInfoDivs[player.getID()];

        const nameDiv = playerInfoDiv.getElementsByClassName("name")[0];
        nameDiv.innerText = player.getName()

        const editDiv = playerInfoDiv.getElementsByClassName("name-edit")[0];

        let editIcon = editDiv.getElementsByClassName("edit-icon")[0]
        if (editIcon === undefined){
        editIcon = document.createElement("img");
        editIcon.src = "images/edit_icon.png";
        editIcon.alt = "Edit";
        editIcon.classList = "edit-icon";
        } else {
            editIcon = editDiv.getElementsByClassName("edit-icon")[0];
        }

        editIcon.addEventListener("click", editNameForm);

        editDiv.appendChild(editIcon);
    };

    const render = () => {
        addPlayer(player1);
        addPlayer(player2);
    };

    const reRender = () => {
        render();
        MessageController.render();
    }
    
    return {render};
})(document)

const PlayerInfoSymbolController = ((doc) => {

    const playerInfoDivs = {
        player1 : doc.querySelector(player1.getquerySelector()),
        player2 : doc.querySelector(player2.getquerySelector())
    };

    const changeSymbol = (e) => {
        e.preventDefault();
        const newSymbol = e.target.querySelector("input").value.substring(0, 1);
        const playerIDElement = e.target.parentElement.parentElement.id
        const playerID = playerIDElement.substring(0, playerIDElement.indexOf("-"));
        
        let oldSymbol = "";
        if (playerID === player1.getID()) {
            if (player2.getSymbol().toLowerCase() !== newSymbol.toLowerCase()) {
                oldSymbol = player1.getSymbol();
                player1.setSymbol(newSymbol);
            }
        }
        else if (player1.getSymbol().toLowerCase() !== newSymbol.toLowerCase()) {
            oldSymbol = player2.getSymbol();
            player2.setSymbol(newSymbol);
        }
        
        if (oldSymbol !== "") Gameboard.refreshBoardSymbols(oldSymbol, newSymbol);
        reRender();
    }

    const editSymbolForm = (e) => {
        const editIcon = e.target;
        editIcon.removeEventListener("click", editSymbolForm);
        const symbolDiv = editIcon.parentElement.parentElement.getElementsByClassName("symbol")[0];
        symbolDiv.innerText = "";
        const symbolForm = doc.createElement("form");
        symbolForm.addEventListener("submit", changeSymbol)

        const formInput = doc.createElement("input");

        symbolForm.appendChild(formInput);
        symbolDiv.appendChild(symbolForm);
    }


    const addPlayer = (player) => {
        const playerInfoDiv = playerInfoDivs[player.getID()];

        const symbolDiv = playerInfoDiv.getElementsByClassName("symbol")[0];
        symbolDiv.innerText = player.getSymbol()

        const editDiv = playerInfoDiv.getElementsByClassName("symbol-edit")[0];

        let editIcon = editDiv.getElementsByClassName("edit-icon")[0]
        if (editIcon === undefined){
        editIcon = document.createElement("img");
        editIcon.src = "images/edit_icon.png";
        editIcon.alt = "Edit";
        editIcon.classList = "edit-icon";
        } else {
            editIcon = editDiv.getElementsByClassName("edit-icon")[0];
        }

        editIcon.addEventListener("click", editSymbolForm);

        editDiv.appendChild(editIcon);
    };

    const render = () => {
        addPlayer(player1);
        addPlayer(player2);
    };

    const reRender = () => {
        TurnHandler.refreshSymbols()
        render();
        MessageController.render();
        BoardController.render();
    }
    
    return {render};
})(document);

const PlayerInfoController = (() => {

    const render = () => {
        PlayerInfoNameControlloer.render();
        PlayerInfoSymbolController.render();
    };
    
    return {render};
})(document);

const InfoController = (() => {
    const render = () => {
        PlayerInfoController.render();
    };
    
    return {render};
})();

const ChangePlayerButtonController = ((doc) => {
    const btnDiv = doc.querySelector("#change-player-btn");

    const removeBtn = () => btnDiv.removeChild(btnDiv.firstElementChild);

    const changePlayer = (e) => {
        if (e.target.classList.value === "yes-btn"){
            TurnHandler.changeTurn();
            reRender();
        }
    }

    const addBtn = () => {
        btn = doc.createElement("button");

        if (!Gameboard.isEmpty() && !handleGame.isOver()) {
            btn.classList = "gray-btn"
        }
        else {
            btn.classList = "yes-btn"
        }

        btn.innerText = "Toggle Player to Start"
        
        btn.addEventListener("click", changePlayer);
        btnDiv.appendChild(btn);
    }

    const reRender = () => {
        TurnMessageController.render();
        render();
    }

    const render = () => {
        removeBtn();
        addBtn();
    }

    return {render};


})(document);

const ResetScoreButtonController = ((doc) => {
    const btnDiv = doc.querySelector("#reset-score-btn");

    const removeBtn = () => btnDiv.removeChild(btnDiv.firstElementChild);

    const resetScore = (e) => {
        if (e.target.classList.value === "yes-btn"){
            ScoreTracker.resetScores();
            reRender();
        }
    }

    const addBtn = () => {
        btn = doc.createElement("button");
        btn.innerText = "Reset Scores";

        if (ScoreTracker.getGamesPlayed() === 0) btn.classList = "gray-btn";
        else btn.classList = "yes-btn";        
        
        btn.addEventListener("click", resetScore);
        btnDiv.appendChild(btn);
    }

    const render = () => {
        removeBtn();
        addBtn();
    }

    const reRender = () => {
        InfoController.render();
        render();
        ChangePlayerButtonController.render();
    }

    return {render};

})(document);

const ResetGameButtonController = ((doc) => {
    const btnDiv = doc.querySelector("#reset-game-btn");

    const removeBtn = () => btnDiv.removeChild(btnDiv.firstElementChild);

    const resetGame = (e) => {
        if (e.target.classList.value === "yes-btn"){
            Gameboard.reset();
            reRender();
        }
    }

    const addBtn = () => {
        btn = doc.createElement("button");
        if (handleGame.isOver()) {
            btn.innerText = "New Game";
            btn.classList = "yes-btn"
        } else if (!Gameboard.isEmpty() && !handleGame.isOver()) {
            btn.innerText = "Reset Game";
            btn.classList = "yes-btn"
        } else {
            btn.innerText = "Reset Game";
            btn.classList = "gray-btn"
        } 

        btn.addEventListener("click", resetGame);
        btnDiv.appendChild(btn);
    }
    
    const reRender = () => {
        BoardController.render();
        InfoController.render();
        MessageController.render();
        render();
        ChangePlayerButtonController.render();
    }

    const render = () => {
        removeBtn();
        addBtn();
    }

    return {render};

})(document);


const ButtonsController = (() => {
    const render = () => {
        ResetGameButtonController.render();
        ResetScoreButtonController.render();
        ChangePlayerButtonController.render();
    }

    return {render};
})();

const BoardController = ((doc) => {
    const htmlBoard = doc.querySelector("#board");

    // EventHandlers
    const addCell = (htmlBoard, row, column) => {
        const cell = doc.createElement("div");
        
        const entry = Gameboard.getCellInput(row, column);

        cell.dataset.row = row;
        cell.dataset.column = column;
        cell.classList.add("cell");
        cell.innerText = entry;
        if (handleGame.isWinningEntry(row, column)) cell.classList.add("winner");
        if (Gameboard.isEmptyCell(row, column)) cell.classList.add("empty-cell");
        if (handleGame.isOver()) cell.classList.remove("empty-cell");
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
        ScoreTracker.addResult();
        reRender();
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
    }

    const reRender = () => {
        render();
        MessageController.render();
        ButtonsController.render();
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

    return {render}

})(document);



const mainController = ((doc) => {
    const render = () => {
        BoardController.render();
        MessageController.render();
        InfoController.render();
        ButtonsController.render();
    }

    render();

})(document)