export interface Card {
    face: string,
    value: string
}

export default class Deck {
    private cg = this.cardsGenerator()
    private faces = ['club', 'diamond', 'heart', 'spade']
    private values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'king', 'queen']
    private deck: Array<Card> = (this.faces.map((face) => {
        return this.values.map((value) => {
            return {face, value}
        })
    })).flat();
    
    private *cardsGenerator() {
        while (this.deck.length > 0) {
            const cardIndex = Math.floor(Math.random() * this.deck.length)
            const card = this.deck[cardIndex]
            this.deck.splice(cardIndex, 1)
            yield card
        }
    }

    newCard() {
        return this.cg.next().value as Card
    }
}

export interface CardWorth {
    major: number,
    minor: number,
    cardIndeces: Array<number>
}

export function getCardValue(card: Card): number {
    if (card.value === '2') return 2
    if (card.value === '3') return 3
    if (card.value === '4') return 4
    if (card.value === '5') return 5
    if (card.value === '6') return 6
    if (card.value === '7') return 7
    if (card.value === '8') return 8
    if (card.value === '9') return 9
    if (card.value === '10') return 10
    if (card.value === 'jack') return 11
    if (card.value === 'queen') return 12
    if (card.value === 'king') return 13
    if (card.value === '1') return 14
    return 0
}

export function getHandWorth(deckCards: [Card, Card, Card, Card, Card], playerCards: [Card, Card]): CardWorth {
    //royal flush
    //straight flush
    //four of a kind
    const fourPairCards = countValueOccurrences([...deckCards, ...playerCards]).filter((el) => el.occurrences === 4)
    if (fourPairCards.length >= 1) {
        return {
            major: 7,
            minor: fourPairCards[0].value,
            cardIndeces: fourPairCards[0].indeces
        }
    }
    //full house
    const threePairCards = countValueOccurrences([...deckCards, ...playerCards]).filter((el) => el.occurrences === 3)
    const pairCards = countValueOccurrences([...deckCards, ...playerCards]).filter((el) => el.occurrences === 2)
    if (threePairCards.length >= 1 && pairCards.length >= 1) {
        const highestThrice = threePairCards.sort((a,b) => b.value - a.value)[0]
        const highestPair = pairCards.sort((a,b) => b.value - a.value)[0]
        return {
            major: 6,
            minor: Math.max(highestThrice.value, highestPair.value),
            cardIndeces: [...highestThrice.indeces, ...highestPair.indeces]
        }
    }
    //flush
    const allCards = [...deckCards, ...playerCards]
    const flushCards = countFaceOccurrences(allCards).filter((el) => el.occurrences >= 5)
    if (flushCards.length >= 1) {
        if (flushCards[0].indeces.map((i) => getCardValue(allCards[i])).includes(1)) {
            const aceIndex = flushCards[0].indeces.findIndex((i) => getCardValue(allCards[i]) === 1)
            flushCards[0].indeces[aceIndex] = 14
        }
        const highestFlushIndeces = flushCards[0].indeces.sort((a,b) => getCardValue(allCards[b]) - getCardValue(allCards[a])).slice(0, 5)
        return {
            major: 5,
            minor: flushCards[0].value,
            cardIndeces: highestFlushIndeces
        }
    }
    //straight
    let highestStraight: CardWorth | undefined = undefined
    const allCardValues = [...deckCards.map((c) => getCardValue(c)), ...playerCards.map((c) => getCardValue(c))]
    if (
        allCardValues.includes(14) &&
        allCardValues.includes(2) &&
        allCardValues.includes(3) &&
        allCardValues.includes(4) &&
        allCardValues.includes(5)
    ) {
        highestStraight = {
            major: 4,
            minor: 5,
            cardIndeces: [
                allCardValues.findIndex((c) => c === 14),
                allCardValues.findIndex((c) => c === 2),
                allCardValues.findIndex((c) => c === 3),
                allCardValues.findIndex((c) => c === 4),
                allCardValues.findIndex((c) => c === 5),
            ]
        }
    }
    for(let [index, cardValue] of allCardValues.entries()) {
        if (
            allCardValues.includes(cardValue + 1) &&
            allCardValues.includes(cardValue + 2) &&
            allCardValues.includes(cardValue + 3) &&
            allCardValues.includes(cardValue + 4) &&
            (!highestStraight || highestStraight.minor < cardValue + 4)
        ) {
            highestStraight = {
                major: 4,
                minor: cardValue + 4,
                cardIndeces: [
                    allCardValues.findIndex((c) => c === cardValue),
                    allCardValues.findIndex((c) => c === cardValue + 1),
                    allCardValues.findIndex((c) => c === cardValue + 2),
                    allCardValues.findIndex((c) => c === cardValue + 3),
                    allCardValues.findIndex((c) => c === cardValue + 4)
                ]
            }
        }
    }
    if (highestStraight) return highestStraight
    //three of a kind
    if (threePairCards.length >= 1) {
        const highestThrice = threePairCards.sort((a,b) => b.value - a.value)[0]
        return {
            major: 3,
            minor: highestThrice.value,
            cardIndeces: highestThrice.indeces
        }
    }
    //two pair
    if (pairCards.length >= 2) {
        const highestPair = pairCards.sort((a,b) => b.value - a.value)[0]
        const secondHighestPair = pairCards.sort((a,b) => b.value - a.value)[1]
        return {
            major: 2,
            minor: highestPair.value,
            cardIndeces: [...highestPair.indeces, ...secondHighestPair.indeces]
        }
    }
    //one pair
    if (pairCards.length >= 1) {
        const highestPair = pairCards.sort((a,b) => b.value - a.value)[0]
        return {
            major: 1,
            minor: highestPair.value,
            cardIndeces: highestPair.indeces
        }
    }
    //high card
    if (playerCards.map((card) => getCardValue(card)).includes(1)) {
        return {
            major: 0,
            minor: 14,
            cardIndeces: [5 + playerCards.findIndex((card) => getCardValue(card) === 1)]
        }
    }
    const highestCard = Math.max(...playerCards.map((card) => getCardValue(card)))
    return {
        major: 0,
        minor: highestCard,
        cardIndeces: [5 + playerCards.findIndex((card) => getCardValue(card) === highestCard)]
    }
}

function countValueOccurrences(array: Array<Card>): Array<{value: number, occurrences: number, indeces: Array<number>}> {
    const counts: Record<number, {occurrences: number, indeces: Array<number>}> = {}
    for (let [index, card] of array.entries()) {
        const cardWorth = getCardValue(card)
        counts[cardWorth] = {
            occurrences: (counts[cardWorth]?.occurrences ?? 0) + 1,
            indeces: [...(counts[cardWorth]?.indeces ?? []), index]
        }
    }
    return Object.keys(counts).map((key) => {
        return {
            value: parseInt(key),
            occurrences: counts[parseInt(key)].occurrences,
            indeces: counts[parseInt(key)].indeces
        }
    })
}

function countFaceOccurrences(array: Array<Card>): Array<{face: string, value: number, occurrences: number, indeces: Array<number>}> {
    const counts: Record<string, {occurrences: number, indeces: Array<number>}> = {}
    for (let [index, card] of array.entries()) {
        counts[card.face] = {
            occurrences: (counts[card.face]?.occurrences ?? 0) + 1,
            indeces: [...(counts[card.face]?.indeces ?? []), index]
        }
    }
    return Object.keys(counts).map((key) => {
        return {
            face: key,
            value: Math.max(...counts[key].indeces.map((i) => getCardValue(array[i]))),
            occurrences: counts[key].occurrences,
            indeces: counts[key].indeces
        }
    })
}