function $(str) {
    return document.querySelector(str)
}

let field = $('.field')
let gameOverButton = $('.mineButton')
let restart = $('.restart')
let difficults = document.querySelectorAll('.minesweeperLevel div')
let currentNumberOfBombsSpan = $('.navigationRight span')
let timeClock = $('.time')
let gameWinnedWindow = $('.gameWinned')
let gameWinnedButton = $('.gameWinned button')

let fieldRows = 15
let fieldCols = 30
let numberOfBombs = 90
let currentNumberOfBombs
let firstClick = true
let inGame = true
let openedSquares = 0
let difficult = [60, 90, 100]

let timeInt
let time = [[0], [0]]
let firstClickCoord = []
let colors = ['fakeFlagged', 'trueFlagged', 'flagged', 'bomb', 'blue', 'green', 'red', 'darkBlue', 'purple', 'cyan', 'darkRed', 'black']   
let squares = []
let squaresDigit = []

field.addEventListener('mousedown', () => {
    if (inGame) gameOverButton.style.backgroundColor = 'yellow'

})

field.addEventListener('mouseup', () => {
    if (inGame) gameOverButton.style.backgroundColor = 'chartreuse'
})

gameWinnedButton.addEventListener('click', () => {
    gameWinnedWindow.classList.add('disabled')
})

difficults[1].style.backgroundColor = 'orangered'

difficults.forEach((item, index) => {
    item.addEventListener('click', () => {
        numberOfBombs = difficult[index]
        difficults.forEach((button) => {
            button.style.backgroundColor = '#ccc'
            button.style.color = 'black'
        })
        item.style.backgroundColor = 'orangered'
        item.style.color = 'white'

        if (firstClick) {
            currentNumberOfBombs = numberOfBombs
            updateNumberOfBombsSpan()
        }
        
    })
})


currentNumberOfBombs = numberOfBombs

for (let i = 0; i < fieldRows; i++) {
    squares.push([])
    squaresDigit.push([])
    
    for (let j = 0; j < fieldCols; j++) {
        let tempSquare = document.createElement('div')
        tempSquare.classList.add('square')
        // tempSquare.classList.add('blue')

        tempSquare.classList.add('squareDefault')

        tempSquare.setAttribute('row', i)
        tempSquare.setAttribute('col', j)

        squares[i].push(tempSquare)
        squaresDigit[i].push('')


        field.appendChild(tempSquare)

    }
    
}

function resetField() {
    inGame = true
    squaresDigit = []
    firstClick = true
    currentNumberOfBombs = numberOfBombs
    openedSquares = 0

    time = [[0], [0]]
    clearInterval(timeInt)
    timeClock.textContent = '00:00'

    gameOverButton.style.backgroundColor = 'chartreuse'
    restart.classList.add('disabled')
    // restart.classList.add('animation')

    // console.log(squares);
    // console.log(squaresDigit);
    for (let i = 0; i < fieldRows; i++) {
        squaresDigit.push([])
        for (let j = 0; j < fieldCols; j++) {
            let tempSquare = squares[i][j]
            // tempSquare.classList.add('blue')
            squaresDigit[i].push('')

            tempSquare.classList.add('squareDefault')
            tempSquare.classList.remove('squareOpened')
            tempSquare.removeAttribute('state')
            tempSquare.textContent = ''

            colors.forEach(item => {
                tempSquare.classList.remove(item)
            })

        }
    }
    // console.log(squaresDigit);

    updateNumberOfBombsSpan()
}

function generateBombsAndDigits() {
    for (let i = 0; i < numberOfBombs; i++) {
        let tempRow
        let tempCol
        
        do {
            tempRow = Math.floor(Math.random() * fieldRows)
            tempCol = Math.floor(Math.random() * fieldCols)
    
        } while (squaresDigit[tempRow][tempCol] == 'B' 
        || (tempRow == firstClickCoord[0] && tempCol == firstClickCoord[1])
        || (tempRow == firstClickCoord[0] + 1 && tempCol == firstClickCoord[1])
        || (tempRow == firstClickCoord[0] + 1 && tempCol == firstClickCoord[1] + 1)
        || (tempRow == firstClickCoord[0] - 1 && tempCol == firstClickCoord[1] - 1))
    
    
        squaresDigit[tempRow][tempCol] = 'B'
    
        tempSquare = squares[tempRow][tempCol]
        tempSquare.setAttribute('state', 'B')
        // tempSquare.classList.add('bomb')
        // tempSquare.textContent = 'B'
    
        
    }

    for (let i = 0; i < fieldRows; i++) {
        for (let j = 0; j < fieldCols; j++) {
            // Считаем количество бомб-соседей для каждого элемента и записываем 
            let tempDigit = squaresDigit[i][j]
            let tempSquare = squares[i][j]
            if (tempDigit != 'B') {
                tempDigit = countSymbol(findNeighbours(i, j), 'B')
                tempSquare.setAttribute('state', tempDigit)
                // if (tempDigit != 0) {
                //     tempSquare.textContent = tempDigit

                // }
    
            }
    
            // Делаем цвет для конкретных чисел в каждой клетке

            switch (tempDigit) {
                case 1: {
                    tempSquare.classList.add('blue')
                    break
                }
                case 2: {
                    tempSquare.classList.add('green')
                    break
                }
                case 3: {
                    tempSquare.classList.add('red')
                    break
                }
                case 4: {
                    tempSquare.classList.add('darkBlue')
                    break
                }
                case 5: {
                    tempSquare.classList.add('purple')
                    break
                }
                case 6: {
                    tempSquare.classList.add('cyan')
                    break
                }
                case 7: {
                    tempSquare.classList.add('darkRed')
                    break
                }
                case 8: {
                    tempSquare.classList.add('black')
                    break
                }
            }
        }
        
    }
}

function createField() {
    
    
    for (let i = 0; i < fieldRows; i++) {
        for (let j = 0; j < fieldCols; j++) {
            let tempSquare = squares[i][j]
                
            // Слушатель на нажатия
    
            tempSquare.addEventListener('click', actionsOnClick)

            // if (squaresDigit[i][j] == 'B') console.log('kjgl');
            
        }
        
    }
}

function deleteListeners() {
    for (let i = 0; i < fieldRows; i++) {
        for (let j = 0; j < fieldCols; j++) {
            let tempSquare = squares[i][j]

            tempSquare.removeEventListener('contextmenu', actionsOnRightClick)
            tempSquare.removeEventListener('click', actionsOnClick)
            tempSquare.removeEventListener('contextmenu', actionsOnEnotherRightClick)

        }
        
    }
}

function makeDouble(int) {
    if (int < 10) return ('0' + int)
    return int
}

function actionsOnClick(event) {
    if (firstClick) { // Проверка, первый ли это клик по полю
        firstClick = false
        firstClickCoord = [event.target.getAttribute('row'), event.target.getAttribute('col')]
        generateBombsAndDigits()
        for (let i = 0; i < fieldRows; i++) {
            for (let j = 0; j < fieldCols; j++) {
                let tempSquare = squares[i][j]
                tempSquare.addEventListener('contextmenu', actionsOnRightClick)
                
            }
            
        }
        timeInt = setInterval(() => {
            time[1]++
            if (time[1] == 60) {
                time[0]++
                time[1] = 0
            }
            timeClock.textContent = `${makeDouble(time[0])}:${makeDouble(time[1])}`
        }, 1000)
    }

    if (event.target.getAttribute('state') == 'B') {
        // gameOver.classList.remove('disabled')
        gameOverButton.style.backgroundColor = 'tomato'
        inGame = false
        restart.classList.remove('disabled')
        deleteListeners()
        showAllBombs()
        clearInterval(timeInt)
        
    }

    event.target.classList.remove('squareDefault')
    event.target.classList.add('squareOpened')

    if (event.target.getAttribute('state') != 0 && event.target.getAttribute('state') != 'B') {
        event.target.textContent = event.target.getAttribute('state')

    }
    // Отключаем нажатие ПКМ на эту кнопку
    event.target.removeEventListener('contextmenu', actionsOnRightClick)
    event.target.removeEventListener('click', actionsOnClick)

    if (event.target.getAttribute('state') == 0) {
        findAllZeroSquaresAndNeighbours(event.target)
        // console.log('Енто элемент с нулём бомб вокруг');
    }

    // if (event.target.getAttribute('state') == 'B') {
    //     event.target.classList.add('bomb')
    //     // console.log('Енто элемент с нулём бомб вокруг');
    // }
    // event.target.setAttribute('state', 'Opened')



    if (isEverythingRight()) { // Значит игра выиграна
        gameWinnedWindow.classList.remove('disabled')
    }


}

function actionsOnRightClick(event) {
    event.preventDefault()
    event.target.classList.add('flagged')

    event.target.removeEventListener('contextmenu', actionsOnRightClick)
    event.target.removeEventListener('click', actionsOnClick)
    event.target.addEventListener('contextmenu', actionsOnEnotherRightClick)

    currentNumberOfBombs--

    updateNumberOfBombsSpan()

    if (isEverythingRight()) { // Значит игра выиграна
        gameWinnedWindow.classList.remove('disabled')
    }
}

function actionsOnEnotherRightClick(event) {
    event.preventDefault()
    event.target.classList.remove('flagged')

    event.target.addEventListener('click', actionsOnClick)
    event.target.addEventListener('contextmenu', actionsOnRightClick)
    event.target.removeEventListener('contextmenu', actionsOnEnotherRightClick)
    
    currentNumberOfBombs++
    
    updateNumberOfBombsSpan()
}

function isEverythingRight() {
    if (currentNumberOfBombs == 0) {
        let itsOkay = true
        squaresDigit.forEach((item, index) => {
            item.forEach((element, jndex) => {
                if (element == 'B') {
                    if (!squares[index][jndex].classList.contains('flagged')) {
                        itsOkay = false
                    }
                } else if (!squares[index][jndex].classList.contains('squareOpened')) {
                    itsOkay = false
                }
            })
        })
        return itsOkay
    }
}


let zeroRow = []
let zeroCol = []

function findAllZeroSquaresAndNeighbours(item) {
    let tempRow = +item.getAttribute('row')
    let tempCol = +item.getAttribute('col')

    zeroRow = [tempRow]
    zeroCol = [tempCol] 
    

    iterable(tempRow, tempCol)

    zeroRow.forEach((row, index) => {
        let col = zeroCol[index]

        iterable(row, col, 'digit', false)

    })

    zeroRow.forEach((row, index) => {
        let col = zeroCol[index]

        openSquare(squares[row][col])

    })

}

function iterable(tempRow, tempCol, purpose = 'zero', iteration = true) {
    findNeighbours(tempRow, tempCol, squares, purpose).forEach(item => {
        let innerRow = +item.getAttribute('row')
        let innerCol = +item.getAttribute('col')
        let tempBool = true

        zeroRow.forEach((row, i) => {
            if (innerRow == row && innerCol == zeroCol[i]) {
                tempBool = false
            }
        })

        if (tempBool) {
            zeroRow.push(innerRow)
            zeroCol.push(innerCol)
            if (iteration) {
                iterable(innerRow, innerCol)

            }
        }

        
        // console.log(item);
    })
}

function openSquare(item) {
    item.classList.remove('squareDefault')
    item.classList.add('squareOpened')

    if (item.getAttribute('state') != 0) {
        item.textContent = item.getAttribute('state')

    }
    // Отключаем нажатие ПКМ на эту кнопку
    item.removeEventListener('contextmenu', actionsOnRightClick)
    item.removeEventListener('click', actionsOnClick)

    // item.setAttribute('state', 'Opened')
}

function findNeighbours(a, b, matr = squaresDigit, onlyZero = "all") {
    let resVector = []

    for (let i = -1; i <= 1; i++) {
        if (a + i < 0 || a + i > fieldRows - 1) continue
        for (let k = -1; k <= 1; k++) {
            if (b + k < 0 || b + k > fieldCols - 1 || (i == 0 && k == 0)) continue
            // console.log(`${a + i} ${b + k}`)
            if (onlyZero == 'zero') {
                if (matr[a + i][b + k].getAttribute('state') == 0) {
                    resVector.push(matr[a + i][b + k])
                }
            } else if (onlyZero == 'digits') {
                if (matr[a + i][b + k].getAttribute('state') != 0 && matr[a + i][b + k].getAttribute('state') != 'B') {
                    resVector.push(matr[a + i][b + k])
                }
            } else {
                resVector.push(matr[a + i][b + k])

            }

        }
        
    }
    return resVector
}

function countSymbol(vector, symbol) {
    let resNumber = 0
    vector.forEach(element => {
        if (element == symbol) resNumber++
    });
    return resNumber
}

function updateNumberOfBombsSpan() {
    currentNumberOfBombsSpan.textContent = currentNumberOfBombs
}

function showAllBombs(func) {
    for (let i = 0; i < fieldRows; i++) {
        for (let j = 0; j < fieldCols; j++) {
            if (squaresDigit[i][j] == 'B') {
                if (squares[i][j].classList.contains('flagged')) {
                    squares[i][j].classList.remove('flagged')
                    squares[i][j].classList.add('trueFlagged')

                } else {
                    squares[i][j].classList.add('bomb')
                    
                }
            } else {
                if (squares[i][j].classList.contains('flagged')) {
                    squares[i][j].classList.remove('flagged')
                    squares[i][j].classList.add('fakeFlagged')

                }
            }
            
        }
        
    }
}

gameOverButton.addEventListener('click', () => {
    resetField()
    createField()
})

createField()







// function findAllZeroSquaresAndNeighbours(item) {
//     let resVec = []

//     // debugger

//     let tempVector = findNeighbours(+item.getAttribute('row'), +item.getAttribute('col'), squares, "zero")
//     tempVector.forEach(square => {
//         if (square.getAttribute('state') == '0') {
//             resVec.push(square)
//             // square.classList.add('squareOpened')
//             actionForAllZero(square, true)
//             square.classList.remove('squareDefault')
//             console.log(square)
//         }
//     })

//     // console.log(resVec)

//     return resVec
// }

// let tempAllZero = new Set()

// function actionForAllZero(item, recurs) {
//     tempAllZero.add(item)
//     item.classList.remove('squareDefault')
//     item.classList.add('squareOpened')
//     item.style.backgroundColor = 'black'

//     if (item.getAttribute('state') != 0) {
//         item.textContent = item.getAttribute('state')

//     }
//     // Отключаем нажатие ПКМ на эту кнопку
//     item.removeEventListener('contextmenu', actionsOnRightClick)
//     item.removeEventListener('click', actionsOnClick)
//     item.setAttribute('state', 'O')

//     if (recurs) {
//         findAllZeroSquaresAndNeighbours(item).forEach(ttt => {
//             tempAllZero.add(ttt)
//         })

//     }
// }