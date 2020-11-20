let grid = document.querySelector('.grid')

let bigSquare
let smallSquare

console.log('wiogho');

let matrix = []


for(let i = 0; i < 9; i++) {
    bigSquare = document.createElement('div')
    bigSquare.classList.add('bigSquare')

    for(let k = 0; k < 9; k++) {
        smallSquare = document.createElement('input')
        smallSquare.classList.add('smallSquare')
        
        bigSquare.appendChild(smallSquare)
    }
    
    grid.appendChild(bigSquare)
}

let smalls = document.querySelectorAll('.smallSquare')

// smalls.forEach(element => {
//     element.value = Math.floor(Math.random()*8) + 1
// });

firstN = [0, 3, 6, 27, 30, 33, 54, 57, 60]
fff = [0, 1, 2, 9, 10, 11, 18, 19, 20]

for (let i = 0; i < 9; i++) {
    matrix.push([])
    for (let k = 0; k < 9; k++) {
        let item = smalls[firstN[i] + fff[k]]
        item.setAttribute('row', i)
        item.setAttribute('col', k)
        matrix[i].push(item)

    }
    
}



function rectIndex(item) {
    let cubeRow = Math.floor(item.getAttribute('row') / 3)
    let cubeCol = Math.floor(item.getAttribute('col') / 3)

    return (cubeCol * 3 + cubeRow)
}

function rowOfElement(item) {
    return (matrix[item.getAttribute('row')])
}

function colOfElement(item) {
    let temp = []
    for (let index = 0; index < 9; index++) {
        temp.push(matrix[index][item.getAttribute('col')])
        
    }
    return temp
}

function cubeOfElement(item) {
    let temp = []
    for(let i = rectIndex(item) * 9; i < (rectIndex(item) + 1) * 9; i++) {
        temp.push(smalls[i])
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

function randomFill() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let temp = matrix[i][j]
            // temp.value = Math.floor(Math.random() * 8 + 1)
            while (isRepeat(rowOfElement(temp)) || 
            isRepeat(colOfElement(temp)) ||
            isRepeat(cubeOfElement(temp))) {
                temp.value = Math.floor(Math.random() * 8 + 1)
                console.log('снова')
            }
            console.log('ля')
        }
        
    }
    console.log('конец')
}

randomFill()
// Так не получается. надо сделать скрипт который убирал бы 
// символы, которые уже есть из списка возможных