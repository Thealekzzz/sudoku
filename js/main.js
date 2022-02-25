let grid = document.querySelectorAll('.grid')
let generateButtons = document.querySelectorAll('.sudokuButton')
let countInfo = document.querySelector('.countInfo span')
let levels = document.querySelectorAll('.sudokuLevel div')
let digitsCountItems = document.querySelectorAll('.digitsCount')
let highlightDigitsCheckbox = document.querySelector('.highlightDigits')


let bigSquare
let smallSquare
let matrices = [[], []]
let level = 25
let count
let digitsCount = []
let digitsBG = []
let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let highlightDigitsFlag = false

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

function fillMatr(fieldNumber, makeBlocked = true) {
    // console.log(makeBlocked);
    let matrix = matrices[fieldNumber]
    for (let i = 0; i < 9; i++) {
        matrix.push([])
        for (let k = 0; k < 9; k++) {
            let item = smalls[fieldNumber][firstN[i] + fff[k]]
            item.setAttribute('row', i)
            item.setAttribute('col', k)
            item.setAttribute('opened', true)

            if (makeBlocked) {
                item.setAttribute('readonly', true)
                item.classList.add('blocked')

            }

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

function logicalMix(fieldNumber) {
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
    for (let i = 0; i < 50; i++) {
        logicalMix(fieldNumber)
        
    }
}

function upgradedMix(fieldNumber) {
    let tempFrom = Math.round(Math.random() * 8 + 1)
    let tempTo = Math.round(Math.random() * 8 + 1)
    // while ((tempFrom - tempTo) % 3 == 0) {
    //     tempTo = Math.round(Math.random() * 8 + 1)
    // }
    let vectorFrom = findSameDigitByDigit(fieldNumber, tempFrom)
    let vectorTo = findSameDigitByDigit(fieldNumber, tempTo)
    for (let i = 0; i < 9; i++) {
        vectorFrom[i].value = tempTo
        vectorTo[i].value = tempFrom
    }
}

function upgradedFill(fieldNumber) {
    makeBasicGrid(fieldNumber)
    for (let i = 0; i < 35; i++) {
        upgradedMix(fieldNumber)
    }

    for (let i = 0; i < 10; i++) {
        logicalMix(fieldNumber)
        
    }

}

function deleteElements(fieldNumber) {
    let temp = 0
    
    let closed = 0
    let target = 81 - level
    // console.log(target);
    while (closed < target) {
        let elemRowIndex = randomN(8)
        let elemColIndex = randomN(8)
        let tempItem = matrices[fieldNumber][elemRowIndex][elemColIndex]
        temp++

        // console.log('possibleN(tempItem, fieldNumber): ', possibleN(tempItem, fieldNumber));

        if (tempItem.getAttribute('opened') == 'true' && possibleN(tempItem, fieldNumber).length < 4) {
            
            tempItem.setAttribute('opened', false)
            tempItem.removeAttribute('readonly')

            tempItem.classList.remove('blocked')

            tempItem.value = ''
            closed++
            temp--
        }

        
    }
    console.log(temp);
}

function countOpened(fieldNumber) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (matrices[fieldNumber][i][j].getAttribute('opened') == 'true') console.log('открытый');
            
        }
        
    }
}

function findSameDigitByDigit(fieldNumber, digit) {
    let matrix = matrices[fieldNumber]
    let tempVector = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (digit == matrix[i][j].value) tempVector.push(matrix[i][j])
        }
    }

    return tempVector
}

function findSameDigitByItem(fieldNumber, item) {
    if (item.value == '') return []
    let matrix = matrices[fieldNumber]
    let tempVector = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (item.value == matrix[i][j].value) tempVector.push(matrix[i][j])
        }
    }

    return tempVector
}

function addHighlights(fieldNumber) {
    if (highlightDigitsFlag) {
        
        smalls[fieldNumber].forEach(item => {
            item.addEventListener('click', () => {
                if (sameDigits != undefined && sameDigits != []) {
                    sameDigits.forEach(item => {
                        if (item.classList.contains('blocked')) item.style.backgroundColor = '#f2f2f2'
                        else item.style.backgroundColor = 'white'
                    })
                }
                sameDigits = findSameDigitByItem(fieldNumber, item)
                sameDigits.forEach(item => item.style.backgroundColor = '#EE9999')
            })
    
            
    
            item.addEventListener('input', () => {
                let tempValue = item.value
                if ((tempValue > 9 || tempValue < 1) && tempValue != '') {
                    item.value = tempValue[tempValue.length - 1]
                }
    
                if (sameDigits != undefined && sameDigits != []) {
                    sameDigits.forEach(item => {
                        if (item.classList.contains('blocked')) item.style.backgroundColor = '#f2f2f2'
                        else item.style.backgroundColor = 'white'
                    })
                }
                sameDigits = findSameDigitByItem(fieldNumber, item)
                sameDigits.forEach(item => item.style.backgroundColor = '#EE9999')
                updateDigitsCount(fieldNumber)
            })
        })

    }
}

function updateDigitsCount(fieldNumber) {
    let tempCountOfFilled = 0
    digitsCount[fieldNumber].forEach((item, index) => {
        let tempCount = findSameDigitByDigit(fieldNumber, index + 1).length
        item.textContent = tempCount
        if (tempCount == 9) {
            tempCountOfFilled++
            digitsBG[fieldNumber][index].style.backgroundColor = 'seagreen'
        } else {
            digitsBG[fieldNumber][index].style.backgroundColor = '#666'
        }
    })
    if (tempCountOfFilled == 9) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                matrices[fieldNumber][i][j].style.backgroundColor = '#aaeeaa'
            }
        }
    }
}

function hasRepeated(vector) {
    let setFromVector = new Set(vector)
    return !(setFromVector.size == vector.length)
}

// Необходимо сделать скрипт который убирал бы 
// символы, которые уже есть из списка возможных - Не работает, но
// реализовал скрипт,который
// генерирует новое поле каждый раз, когда встречается клетка,
// в которую нельзя поставить ни одну цифру ( может делать 
// очень много повторений, например 500 )

let sameDigits

function addEventL(button, func) {
    button.addEventListener('click', () => {
        func()
    })
}


highlightDigitsCheckbox.addEventListener("click", () => {
    highlightDigitsFlag = !highlightDigitsFlag


})


generateButtons.forEach((button, index) => {
    fieldCreation(index)

    addEventL(button, () => {
        fieldCreation(index)
        matrices[index] = fillMatr(index)
        addHighlights(index)
    })
    
    
    switch (index) {
        case 0: {
            addEventL(button, () => {
                upgradedFill(index)
                deleteElements(index)
                updateDigitsCount(index)
                
            })
            
            break
        }

        case 1: {
            addEventL(button, () => {
                logicalFill(index)
                deleteElements(index)
                updateDigitsCount(index)
                
            })
                        
            break
        }

        case 2: {
            addEventL(button, () => {
                fieldCreation(index)
                matrices[index] = fillMatr(index, false)
                addHighlights(index)
                // upgradedFill(index)
                // count = 0
                // randomFill(index)
                makeBasicGrid(index)

            })
        }

    }
})


digitsCountItems.forEach(item => {
    digitsCount.push(item.querySelectorAll('.digitWrapper span'))
    digitsBG.push(item.querySelectorAll('.digit'))
})



levels.forEach((item, index) => {
    item.addEventListener('click', () => {
        levels.forEach((button) => {
            button.style.backgroundColor = '#ccc'
            button.style.color = 'black'
        })
        item.style.backgroundColor = 'orangered'
        item.style.color = 'white'
        switch (index) {
            case 0: {
                level = 40
                break
            }

            case 1: {
                level = 37
                break
            }

            case 2: {
                level = 30
                break
            }
        }
    })
})

// Делаем подсветку изначального уровня
levels[1].style.backgroundColor = 'orangered'
levels[1].style.color = 'white'
