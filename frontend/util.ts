interface LocalStored {
    "displayname": string
    "last-room": string
}

const amountToChips = (amount: number) => {
  let result = [0, 0, 0, 0]

  while (amount >= 25 && result[0] <= 5) {
    result[0] += 1
    amount -= 25
  }
  while (amount >= 50 && result[1] <= 5) {
    result[1] += 1
    amount -= 50
  }
  while (amount >= 100 && result[2] <= 5) {
    result[2] += 1
    amount -= 100
  }
  while (amount >= 500 && result[3] <= 5) {
    result[3] += 1
    amount -= 500
  }
  while (amount >= 100) {
    result[2] += 1
    amount -= 100
  }
  while (amount >= 50) {
    result[1] += 1
    amount -= 50
  }
  while (amount >= 25) {
    result[0] += 1
    amount -= 25
  }

  return result
}

const ls = <L extends keyof LocalStored>(
  key: L,
  value?: LocalStored[L]
): LocalStored[L] | null =>
  void 0 !== value
    ? localStorage.setItem(key, JSON.stringify(value))
    : JSON.parse(localStorage.getItem(key) as string)


const stagger = (callbacks: Array<() => void>, delay: number) => {
  let i = 0
  const fn = () => {
    if (i < callbacks.length) {
      callbacks[i]()
      i += 1
      setTimeout(fn, delay)
    }
  }

  fn()
}

export {
  ls,
  amountToChips,
  stagger
}

