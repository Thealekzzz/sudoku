let grid = document.querySelectorAll('.grid')
let generateButtons = document.querySelectorAll('button')
let countInfo = document.querySelector('.countInfo span')

let bigSquare
let smallSquare
let matrices = [[], []]
let level =25
let count

let smalls = [[], []]

// window.onbeforeunload = function() {
// 	return true;
// };

function fieldDeleting(fieldNumber) {
    grid[fieldNumber].innerHTML = ''
    matrices[fieldNumber] = []
    smalls[fieldNumber] = []
}

function fieldCreation(fieldNumber) {
    let field = grid[fieldNumber]
    fieldDeleting(fieldNumber)
    for(let i = 0; i < 9; i++) {
        bigSquare = document.createElement('div')
        bigSquare.classList.add('bigSquare')
    
        for(let k = 0; k < 9; k++) {
            smallSquare = document.createElement('input')
            smallSquare.classList.add('smallSquare')
            
            bigSquare.appendChild(smallSquare)
        }
        
        field.appendChild(bigSquare)
    }

    smalls[fieldNumber] = field.querySelectorAll('.smallSquare')

}



firstN = [0, 3, 6, 27, 30, 33, 54, 57, 60]
fff = [0, 1, 2, 9, 10, 11, 18, 19, 20]

function fillMatr(fieldNumber) {
    let matrix = matrices[fieldNumber]
    for (let i = 0; i < 9; i++) {
        matrix.push([])
        for (let k = 0; k < 9; k++) {
            let item = smalls[fieldNumber][firstN[i] + fff[k]]
            item.setAttribute('row', i)
            item.setAttribute('col', k)
            item.setAttribute('opened', true)
            item.setAttribute('disabled', true)

            item.classList.add('blocked')
            matrix[i].push(item)
    
        }
        
    }

    return matrix

}



function rectIndex(item) {
    let cubeRow = Math.floor(item.getAttribute('row') / 3)
    let cubeCol = Math.floor(item.getAttribute('col') / 3)

    return (cubeRow * 3 + cubeCol)
}

function rowOfElement(item, fieldNumber) {
    matrix = matrices[fieldNumber]
    return (matrix[item.getAttribute('row')])
}

function colOfElement(item, fieldNumber) {
    let matrix = matrices[fieldNumber]
    let temp = []
    for (let index = 0; index < 9; index++) {
        temp.push(matrix[index][item.getAttribute('col')])
        
    }
    return temp
}

function cubeOfElement(item, fieldNumber) {
    let temp = []
    for(let i = rectIndex(item) * 9; i < (rectIndex(item) + 1) * 9; i++) {
        temp.push(smalls[fieldNumber][i])
    } 
    return temp
}

function isRepeat(arr) {
    let same = 0
    arr.forEach((elem,index) => {
        for (let i = index + 1; i < arr.length; i++) {
            if (elem.value == arr[i].value) same = elem.value
            // console.log(elem.value, arr[i].value)
            
        }
    })
    if (same != 0) return true
    return false
}

function randomFill(fieldNumber) {
    let matrix = matrices[fieldNumber]
    let stop = false
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let temp = matrix[i][j]
            let arr = possibleN(temp, fieldNumber)

            // Заполнение всего поля ( не работает )
            if (arr.length == 0) {
                // debugger
                stop = true

                break
            }
            temp.value = arr[Math.floor(Math.random() * arr.length)] 
        }

        if (stop) break
        
    }

    if (stop) {
        stop = false
        count++
        clearM(matrix)
        randomFill(fieldNumber)

    }

    countInfo.textContent = `Повторных (лишних) генераций: ${count}`
    
    // for (let i = 0; i < level; i++) {
    //     let tRow = Math.floor(Math.random() * 9)
    //     let tCol = Math.floor(Math.random() * 9)
    //     let temp = matrix[tRow][tCol]
    //     let arr = possibleN(temp)

    //     temp.setAttribute('disabled', true)
    //     temp.classList.add('blocked')

    //     temp.value = arr[Math.floor(Math.random() * arr.length)]
    //     // console.log('lgjhl');
                
    // }
    // console.log('конец')


}

function clearM(matrix) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            matrix[i][j].value = ''
        }
    }
}

function possibleN(item, fieldNumber) {
    let field = grid[fieldNumber]
    let existing = new Set()

    cubeOfElement(item, fieldNumber).forEach(element => {
        existing.add(+element.value)
    })

    rowOfElement(item, fieldNumber).forEach(element => {
        existing.add(+element.value)
    })

    colOfElement(item, fieldNumber).forEach(element => {
        existing.add(+element.value)
    })

    existing.delete('')

    let tempDigits = []

    // console.log(existing);

    for (let i = 1; i <= 9; i++) {
        if (!existing.has(i)) {
            tempDigits.push(i)

        }
        
    }

    return tempDigits
}

function makeBasicGrid(fieldnumber) {
    let matrix = matrices[fieldnumber]
    let basicVector = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let offsetForBasicGrig = [0, 3, 6, 1, 4, 7, 2, 5, 8]

    for (let i = 0; i < 9; i++) {
        let tempRow = offsetBy(basicVector, offsetForBasicGrig[i])
        for (let j = 0; j < 9; j++) {
            matrix[i][j].value = tempRow[j]
            
        }
        
    }
}

function offsetBy(vector, num) {
    let newVector = []
    for (let i = 0; i < 9; i++) {
        newVector.push(vector[(i + num) % 9])
    }

    return newVector
}

function swapRows(fieldNumber, a, b) {
    let tempVector = matrices[fieldNumber][a].map(item => {
        return item.value
    }) // Запоминаем значения в строке a

    for (let i = 0; i < 9; i++) {
        matrices[fieldNumber][a][i].value = matrices[fieldNumber][b][i].value
        matrices[fieldNumber][b][i].value = tempVector[i]
        
    }
}

function swapCols(fieldNumber, a, b) {
    let tempVector = matrices[fieldNumber].map((item, index) => {
        return item[a].value
    }) // Запоминаем значения в строке a

    for (let i = 0; i < 9; i++) {
        matrices[fieldNumber][i][a].value = matrices[fieldNumber][i][b].value
        matrices[fieldNumber][i][b].value = tempVector[i]
        
    }
}

function swapRowsOfCube(fieldNumber, a, b) {
    for (let i = 0; i < 3; i++) {
        swapRows(fieldNumber, a * 3 + i, b * 3 + i)
        
    }
}

function swapColsOfCube(fieldNumber, a, b) {
    for (let i = 0; i < 3; i++) {
        swapCols(fieldNumber, a * 3 + i, b * 3 + i)
        
    }
}

function transp(fiendNumber) {
    let tempMatrix = matrices[fiendNumber].map((item, index) => {
        return item.map(elem => elem.value)
    })
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            matrices[fiendNumber][i][j].value = tempMatrix[j][i]

        }
        
    }
}

function mix(fieldNumber) {
    let func = randomN(4)
    let cubes = randomNs()
    let vectors = randomNs()

    switch (func) {
        case 0: {
            swapRows(fieldNumber, cubes[0] * 3 + vectors[0], cubes[0] * 3 + vectors[1])
            break
        }

        case 1: {
            swapCols(fieldNumber, cubes[0] * 3 + vectors[0], cubes[0] * 3 + vectors[1])
            break
        }

        case 2: {
            swapRowsOfCube(fieldNumber, cubes[0], cubes[1])
            break
        }

        case 3: {
            swapColsOfCube(fieldNumber, cubes[0], cubes[1])
            break
        }
        
        case 4: {
            transp(fieldNumber)
            break
        }
    }

}

function randomN(a = 2) {
    return Math.round(Math.random() * a)
}

function randomNs(a = 2) {
    let res = []
    res.push(Math.round(Math.random() * a))
    res.push(Math.round(Math.random() * a))
    while (res[0] == res[1]) {
        res[1] = Math.round(Math.random() * a)
    }
    return res
}

function logicalFill(fieldNumber) {
    makeBasicGrid(fieldNumber)
    for (let i = 0; i < 30; i++) {
        mix(fieldNumber)
        
    }
}

function deleteElements(fieldNumber) {
    let closed = 0
    let target = 81 - level
    while (closed < target) {
        let elemRowIndex = randomN(8)
        let elemColIndex = randomN(8)
        let tempItem = matrices[fieldNumber][elemRowIndex][elemColIndex]

        if (tempItem.getAttribute('opened')) {
            tempItem.setAttribute('opened', false)
            tempItem.removeAttribute('disabled')

            tempItem.classList.remove('blocked')

            tempItem.value = ''
            closed++
        }
    }
}

// Необходимо сделать скрипт который убирал бы 
// символы, которые уже есть из списка возможных - Не работает, но
// реализовал скрипт,который
// генерирует новое поле каждый раз, когда встречается клетка,
// в которую нельзя поставить ни одну цифру ( может делать 
// очень много повторений, например 500 )

generateButtons.forEach((button, index) => {
    fieldCreation(index)
    
    switch (index) {
        case 1: {
            button.addEventListener('click', () => {
                console.log("Первая кнопка");
                fieldCreation(1)
                matrices[1] = fillMatr(1)
                count = 1
                randomFill(1)
                deleteElements(1)
            })

            break
        }
        case 0: {
            button.addEventListener('click', () => {
                console.log("Вторая кнопка");
                fieldCreation(0)
                matrices[0] = fillMatr(0)
                logicalFill(0)
                deleteElements(0)
            })
            
            break
        }
    }
})

