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
            for (let column = 0; column < columnNumber; column++)
            gameboard[row][column] = "";
    }

    const reset = () => clearGameboard();

    const isEmpty = () => {
        for (let row = 0; row < gridSize; row++)
            for (let column = 0; column < columnNumber; column++)
                if (gameboard[row][column] !== "") return false;
        return true;
    }

    const getGridSize = () => gridSize;

    const getCellInput = (row, column) => gameboard[row][column];

    return {reset, isEmpty, playTurn, getGridSize, getCellInput};

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

    const getCurrentTurn = () => {
        return turn;
    }

    const getSymbol1 = () => {
        return symbol1;
    }

    const getSymbol2 = () => {
        return symbol2;
    }

    const changeFirstTurn = () => {
        if (Gameboard.isEmpty()) turn = turn === symbol1 ? symbol2 : symbol1;
    }

    return {playTurn, getCurrentTurn, getSymbol1, getSymbol2, changeFirstTurn};
})();

const domHandler = ((doc) => {
    const htmlBoard = doc.querySelector("#board");

    // EventHandlers
    const addCell = (htmlBoard, row, column) => {
        const cell = doc.createElement("div");
        
        const entry = Gameboard.getCellInput(row, column);

        cell.dataset.row = row;
        cell.dataset.column = column;
        cell.classList = "cell";
        cell.innerText = entry;
        if (entry === "") {
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
        render(TurnHandler.getCurrentTurn());
    }

    const hoverCell = (e) => {
        const cell = e.target;
        const currentTurn = cell.dataset.currentTurn;

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

    const render = (currentTurn) => {
        clearGameboardHtml();
        displayGameboardHtml(currentTurn);
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

})(document);

const Player = (name, symbol) => {
    const setName = (newName) => name = newName;

    const getName = () => name;
    const getSymbol = () => symbol;

    return {setName, getName, getSymbol};
};

const player1 = Player("Player 1", TurnHandler.getSymbol1());
const player2 = Player("Player 2", TurnHandler.getSymbol2());