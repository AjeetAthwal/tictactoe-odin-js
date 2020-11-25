const Gameboard = ((doc) => {
    const rowNumber = 3;
    const columnNumber = 3;
    const Player = (symbol) => {
        return {symbol};
    }

    const player1 = Player("X");
    const player2 = Player("O");

    let turn = player1.symbol;
    
    const gameboard = [ 
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    const playTurn = (e) => {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        gameboard[row][column] = turn;
        turn = turn === player1.symbol ? player2.symbol : player1.symbol;
        clearGameboard();
        displayGameboard();
    }


    const pretendTurn = (e) => {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        
        if (e.target.innerText === "" ){
            e.target.innerText = turn;
            e.target.classList.add("temp-input");
        }
        else {
            e.target.innerText = "";
            e.target.classList.remove("temp-input");
        }
    }

    const addCell = (htmlBoard, row, column) => {
        const cell = document.createElement("div");
        const entry = gameboard[row][column]

        cell.dataset.row = row;
        cell.dataset.column = column;
        cell.classList = "cell";
        cell.innerText = entry;
        if (entry === "") {
            cell.addEventListener("click", playTurn);
            cell.addEventListener("mouseover", pretendTurn);
            cell.addEventListener("mouseout", pretendTurn);
        }

        htmlBoard.appendChild(cell);
    }

    const displayGameboard = () => {
        const htmlBoard = doc.querySelector("#board");
        for (let row = 0; row < rowNumber; row++)
            for (let column = 0; column < columnNumber; column++)
                addCell(htmlBoard, row, column);
    }

    const clearGameboard = () => {
        const htmlBoard = doc.querySelector("#board");
        while (htmlBoard.firstChild) htmlBoard.removeChild(htmlBoard.firstChild);
    }

    const displayPlayer1Symbol = () => {
        return player1.symbol;
    }

    const displayPlayer2Symbol = () => {
        return player2.symbol;
    }

    return {displayGameboard, displayPlayer1Symbol, displayPlayer2Symbol};

})(document)


Gameboard.displayGameboard();