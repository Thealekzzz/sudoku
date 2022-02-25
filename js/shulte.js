function createElem(type="div", classes=[], style={}, inner="") {
    let res = document.createElement(type)

    classes.forEach(elem => {
        res.classList.add(elem)
    })

    for (key in style) {
        res.style.setProperty(key, style[key])
    }

    res.innerHTML = inner

    return res
}


function generateField(dim=10) {
    numNow = 1  
    let lst = []
    shulteField.innerHTML = ""

    for (let i = 0; i < dim ** 2; i++) {
        lst.push(i + 1)
        
    }
    
    for (let i = 0; i < dim ** 2; i++) {
        let temp = Math.round(Math.random() * (dim ** 2 - 1 - i))
        shulteField.appendChild(createElem("div", ["point"], {"width": 100 / dim - fieldGap + "%", "height": 100 / dim - fieldGap + "%"}, lst[temp]))
        lst.splice(temp, 1)
        
    }

    if (dim >= 12) {
        shulteField.style.setProperty("font-size", "16px")
    } else {
        shulteField.style.setProperty("font-size", "20px")
    }
}


function makeFormttedTime(num) {
    if (Math.floor(num / 60) > 9) {
        res = Math.floor(num / 60)
    } else {
        res = "0" + Math.floor(num / 60)
    }

    if (num % 60 > 9) {
        res += ":" + num % 60
    } else {
        res += ":0" + num % 60
    }

    return res
}


function updateTimerText(num) {
    timerButton.innerHTML = makeFormttedTime(num)
}


let shulteField = $(".shulteField")
let numDownButton = $(".numDown")
let numUpButton = $(".numUp")
let numText = $(".num")
let generateButton = $(".generate")
let timerButton = $(".shulteFieldWrapper > .timer")

let dimention = 10
let maxNum = 100
let fieldWidth = 500
let fieldHeight = 500
let fieldGap = 0.3
let numNow = 1
let timerNum = 0
let timerOn = false
let timerInterval
let resultTimeout


numDownButton.addEventListener("click", () => {
    if (dimention > 3) {
        dimention--
        numText.innerHTML = dimention
    }
})

numUpButton.addEventListener("click", () => {
    if (dimention < 15) {
        dimention++
        numText.innerHTML = dimention
    }
})

generateButton.addEventListener("click", () => {
    generateField(dimention) 
})

shulteField.addEventListener("click", event => {
    if (event.target.innerHTML == numNow) {
        numNow++

        event.target.style.setProperty("background-color", "lime")
        setTimeout(() => {
            event.target.style.setProperty("background-color", "")
            
        }, 100);
    } else {
        event.target.style.setProperty("background-color", "tomato")
        setTimeout(() => {
            event.target.style.setProperty("background-color", "")
            
        }, 100);
    }

    if (numNow == dimention ** 2) {
        console.log("Игра завершена")
    }
})


timerButton.addEventListener("click", () => {
    if (timerOn) {
        timerOn = false

        console.log("Секундамер остановлен на " + makeFormttedTime(timerNum))
        
        timerButton.style.setProperty("background-color", "seagreen")

        resultTimeout = setTimeout(() => {
            timerButton.innerHTML = "Запустить секундомер"
            
        }, 2000);

        clearInterval(timerInterval)
        
    } else {
        timerOn = true
        timerNum = 0

        clearTimeout(resultTimeout)
        
        timerButton.style.setProperty("background-color", "#dddddd")
        timerButton.innerHTML = "00:00"

        timerInterval = setInterval(() => {
            timerNum++
            updateTimerText(timerNum)

        }, 1000);
        
    }
})


generateField()
