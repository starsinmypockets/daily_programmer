/* The pancake sorting algorithm is uses a single method, which takes an array, and an index, and reverses the order of the elements up until that index */

/* Write an implementation of the pancake sorting algorithm (aka the prefix sorting algorithm) that returns the states after each flip. */

// based on https://www.geeksforgeeks.org/pancake-sorting/

function pancakeSort(arr) {
    function flip(arr, n) {
        const flipt =  arr.slice(0, n+1).reverse().concat(arr.slice(n+1))
        return flipt
    }

    for (let i = arr.length; i > 1; i--) {
      const max = Math.max(...arr.slice(0, i))
      
      if (arr[i] !== max) {
        arr = flip (arr, arr.indexOf(max))
        arr = flip (arr, i-1)
      }
      console.log('..', arr)
    }
    console.log('>>', arr)
}

pancakeSort([2, 4, 3, 1])
pancakeSort([2,4,3,1,5,6])
