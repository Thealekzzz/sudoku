let grid = document.querySelector('.grid')

let bigSquare
let smallSquare

console.log('wiogho');

let matrix = []


for(let i = 0; i < 9; i++) {
    bigSquare = document.createElement('div')
    bigSquare.classList.add('bigSquare')

    for(let k = 0; k < 9; k++) {
        smallSquare = document.createElement('div')
        smallSquare.classList.add('smallSquare')
        
        bigSquare.appendChild(smallSquare)
    }
    
    grid.appendChild(bigSquare)
}

let smalls = document.querySelectorAll('.smallSquare')

smalls.forEach(element => {
    element.textContent = Math.floor(Math.random()*8) + 1
});

