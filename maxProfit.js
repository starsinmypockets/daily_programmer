function maxProfit(days) {
  const scores = []
  for (let i = 0; i < days.length; i++) {
    for (let j = i+1; j < days.length; j++) {
      scores.push(days[j] - days[i])
    }
  }
  const best = scores.sort().slice(-1)[0]
  return best > 0 ? best : 0
}

console.log(maxProfit([7,1,5,3,6,4]), maxProfit([7,6,4,3,1]), maxProfit([2, 10, 1, 2]))
