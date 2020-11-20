let grid = document.querySelector('.grid')

let bigSquare
let smallSquare
let matrix = []
let digits = [1,2,3,4,5,6,7,8,9]


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

firstN = [0, 3, 6, 27, 30, 33, 54, 57, 60]
fff = [0, 1, 2, 9, 10, 11, 18, 19, 20]

function fillMatr() {
    for (let i = 0; i < 9; i++) {
        matrix.push([])
        for (let k = 0; k < 9; k++) {
            let item = smalls[firstN[i] + fff[k]]
            item.setAttribute('row', i)
            item.setAttribute('col', k)
            matrix[i].push(item)
    
        }
        
    }

}



function rectIndex(item) {
    let cubeRow = Math.floor(item.getAttribute('row') / 3)
    let cubeCol = Math.floor(item.getAttribute('col') / 3)

    return (cubeRow * 3 + cubeCol)
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
    // for (let i = 0; i < 9; i++) {
    //     for (let j = 0; j < 9; j++) {
    //         let temp = matrix[i][j]
    //         let arr = possibleN(temp)

    //         // Заполнение всего поля ( не работает )
    //         temp.value = arr[Math.floor(Math.random() * arr.length)] 
    //     }
        
    // }
    
    for (let i = 0; i < 20; i++) {
        let tRow = Math.floor(Math.random() * 9)
        let tCol = Math.floor(Math.random() * 9)
        let temp = matrix[tRow][tCol]
        let arr = possibleN(temp)

        temp.setAttribute('disabled', true)

        temp.value = arr[Math.floor(Math.random() * arr.length)]
        // console.log('lgjhl');
                
    }
    // console.log('конец')
}

function possibleN(item) {
    let existing = new Set()

    cubeOfElement(item).forEach(element => {
        existing.add(+element.value)
    })

    rowOfElement(item).forEach(element => {
        existing.add(+element.value)
    })

    colOfElement(item).forEach(element => {
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



// Так не получается. надо сделать скрипт который убирал бы 
// символы, которые уже есть из списка возможных
fillMatr()
randomFill()