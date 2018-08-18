/* Given a grid of letters and a list of words, search the grid for each word, and return a list of words from the given list that can be found in the grid. You may look up, down, left or right from the current letter to find the next letter, but not diagonally. You may not use any letter from the grid more than once. */

const grid = [
  ['c', 'a', 't'],
  ['o', 's', 'k'],
  ['p', 'y', 'u']
]

const search = ["cat", "copy", "ask", "sos"]

const forward = grid.reduce((all, row) => all.concat(row), [] )
const backward = forward.revers()

console.log(forward, backward)
