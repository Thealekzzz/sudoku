let cards = document.querySelectorAll('.twoCards .card')
let resCard = $('.oneCard .card')

let cardsNumbers = [0, 0]
let resN = 15

updateCards(0)
updateCards(1)


cards.forEach((item, index) => {
    item.addEventListener('click', () => {
        resN += cardsNumbers[index]
        updateCards(index)
    })
})

function updateCards(index) {
    if (isAvalible((index + 1) % 2)) {
        cardsNumbers[index] = Math.round(Math.random() * (16) - 8)

    } else {
        cardsNumbers[index] = Math.round(Math.random() * (21 - resN))
    }

    cards[index].textContent = cardsNumbers[index]

    resCard.textContent = resN
}

function isAvalible(num = 0) {
    if (resN + cardsNumbers[num] > 21 || resN + cardsNumbers[num] < 0) return false
    return true
}

