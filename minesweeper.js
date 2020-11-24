function $(str) {
    return document.querySelector(str)
}

let field = $('.field')
let gameOver = $('.gameover')
let gameOverButton = $('.gameover button')
// console.log(field);

let fieldRows = 15
let fieldCols = 30
let numberOfBombs = 90
let firstClick = true
let firstClickCoord = []

let colors = ['flagged', 'bomb', 'blue', 'green', 'red', 'darkBlue', 'purple', 'cyan', 'darkRed', 'black']   
let squares = []
let squaresDigit = []

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
    squaresDigit = []
    firstClick = true
    console.log(squares);
    console.log(squaresDigit);
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
}

function generateBombsAndDigits() {
    for (let i = 0; i < numberOfBombs; i++) {
        let tempRow
        let tempCol
        
        do {
            tempRow = Math.floor(Math.random() * fieldRows)
            tempCol = Math.floor(Math.random() * fieldCols)
    
        } while (squaresDigit[tempRow][tempCol] == 'B' || (tempRow == firstClickCoord[0] && tempCol == firstClickCoord[1]))
    
    
        squaresDigit[tempRow][tempCol] = 'B'
    
        tempSquare = squares[tempRow][tempCol]
        tempSquare.setAttribute('state', 'B')
        // tempSquare.classList.add('bomb')
        tempSquare.textContent = 'B'
    
        
    }

    for (let i = 0; i < fieldRows; i++) {
        for (let j = 0; j < fieldCols; j++) {
            // Считаем количество бомб-соседей для каждого элемента и записываем 
            let tempDigit = squaresDigit[i][j]
            let tempSquare = squares[i][j]
            if (tempDigit != 'B') {
                tempDigit = countSymbol(findNeighbours(i, j), 'B')
                tempSquare.setAttribute('state', tempDigit)
                if (tempDigit != 0) {
                    tempSquare.textContent = tempDigit

                }
    
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
    
            tempSquare.addEventListener('contextmenu', actionsOnRightClick)

            // if (squaresDigit[i][j] == 'B') console.log('kjgl');
            
        }
        
    }
}

function actionsOnClick(event) {
    if (firstClick) { // Проверка, первый ли это кдик по полю
        firstClick = false
        firstClickCoord = [event.target.getAttribute('row'), event.target.getAttribute('col')]
        generateBombsAndDigits()
    }

    if (event.target.getAttribute('state') == 'B') {
        gameOver.classList.remove('disabled')
    }

    event.target.classList.remove('squareDefault')
    event.target.classList.add('squareOpened')

    if (event.target.getAttribute('state') != 0) {
        event.target.textContent = event.target.getAttribute('state')

    }
    // Отключаем нажатие ПКМ на эту кнопку
    event.target.removeEventListener('contextmenu', actionsOnRightClick)

    if (event.target.getAttribute('state') == 0) {
        let allZeroAndNeighbour = findAllZeroSquaresAndNeighbours(event.target)
    }


}

function actionsOnRightClick(event) {
    event.preventDefault()
    event.target.classList.add('flagged')

    event.target.removeEventListener('contextmenu', actionsOnRightClick)
    event.target.removeEventListener('click', actionsOnClick)
    event.target.addEventListener('contextmenu', actionsOnEnotherRightClick)
}

function actionsOnEnotherRightClick(event) {
    event.preventDefault()
    event.target.classList.remove('flagged')

    event.target.addEventListener('click', actionsOnClick)
    event.target.addEventListener('contextmenu', actionsOnRightClick)
    event.target.removeEventListener('contextmenu', actionsOnEnotherRightClick)
    

    
}

function findAllZeroSquaresAndNeighbours(item) {
    let resVec = []

    let tempVector = findNeighbours(+item.getAttribute('row'), +item.getAttribute('col'), squares)
    tempVector.forEach(square => {
        if (square.getAttribute('state') == '0') {
            resVec.push(square)
            square.classList.add('squareOpened')
            square.classList.remove('squareDefault')
            console.log(square)
        }
    })

    // console.log(resVec)

    return resVec
}

function findNeighbours(a, b, matr = squaresDigit) {
    let resVector = []

    for (let i = -1; i <= 1; i++) {
        if (a + i < 0 || a + i > fieldRows - 1) continue
        for (let k = -1; k <= 1; k++) {
            if (b + k < 0 || b + k > fieldCols - 1 || (i == 0 && k == 0)) continue
            // console.log(`${a + i} ${b + k}`)
            resVector.push(matr[a + i][b + k])
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

gameOverButton.addEventListener('click', () => {
    gameOver.classList.add('disabled')
    resetField()
    createField()
})

createField()