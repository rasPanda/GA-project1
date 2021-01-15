//! DOM elements

const setupGrid = document.getElementById('grid')
// const gameGrid = Array.from(document.getElementById('grid'))

//! Variables

let width = 9
let height = 9
let minesToSet = 10
let minesLeft = 10

//! Arrays

const cellsArr = []
const minesArr = []
const flaggedArr = []

//! Functions
function createGrid() {
  for (let index = 0; index < width * height; index++) {
    // ? Generate each element
    const cell = document.createElement('div')
    setupGrid.appendChild(cell)
    cellsArr.push(cell)
    // ? Number each cell by its index.
    cell.innerHTML = index
    cell.setAttribute('id', index)
    // ? Set the width and height of grid
    if (width <= 16) {
      setupGrid.style.width = `${25 * width}px`
      setupGrid.style.height = `${25 * height}px`
      cell.style.width = `${100 / width}%`
      cell.style.height = `${100 / height}%`
    } else {
      setupGrid.style.width = `${25 * width}px`
      setupGrid.style.height = '400px'
      cell.style.width = `${100 / width}%`
      cell.style.height = `${100 / height}%`
    }
    cell.setAttribute('class', 'facingDown')
  }
}

function setMines() {
  for (let index = 0; index < minesToSet; index++) {
    minesArr.push(true)
  }
  for (let index = 0; index < (cellsArr.length - minesToSet); index++) {
    minesArr.push(false)
  }
  minesArr.sort(() => 0.5 - Math.random())
}

function createFlagged() {
  for (let index = 0; index < cellsArr.length; index++) {
    flaggedArr.push(false)
  }
}

function createEventListeners() {
  cellsArr.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      leftClick(event)
    })
  })
  cellsArr.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      rightClick(event)
    })
  })
}


function revealCell() {
  
}

function leftClick(event) {
  if (flaggedArr[event.currentTarget.id] === true) {
    // return
    console.log('flag!')
  } else if (minesArr[event.currentTarget.id] === true) {
    console.log('mine!')
  } else {
    console.log('no mine!')

  }
}

// function leftClick(event) {
//   if (flaggedArr[event.currentTarget.id] === true) {
//     return
//   } else if (minesArr[event.currentTarget.id] === true) {
//     for (let index = 0; index < minesArr.length; index++) {
//       if (minesArr[index] === true) {
//         console.log('mine!')
//         // cellsArr[index].classList.remove('facingDown')
//         // cellsArr[index].classList.add('revealed bomb')
//       } else {
//         console.log('no mine!')
//       }
//     }
//     endGame()
//   }
// }

function rightClick(event) {
  if (flaggedArr[event.currentTarget.id] === false) {
    event.preventDefault()
    event.currentTarget.classList.remove('facingDown')
    event.currentTarget.classList.add('flagged')
    flaggedArr[event.currentTarget.id] = true
  } else {
    event.preventDefault()
    event.currentTarget.classList.remove('flagged')
    event.currentTarget.classList.add('facingDown')
    flaggedArr[event.currentTarget.id] = false
  }
}


function endGame() {
  alert('GAME OVER')
}

//! Set up the game

setTimeout(() => {
  createGrid()
  setMines()
  createFlagged()
  createEventListeners()
}, 1)

console.log(cellsArr)
console.log(minesArr)
console.log(flaggedArr)

//! Right click


// grid.addEventListener('contextmenu', (event) =>{
//   event.preventDefault()
//   console.log('right click!')
// })

cellsArr.forEach((cell) => {
  cell.addEventListener('contextmenu', (event) => {
    console.log('right click!')
    if (flaggedArr[event.currentTarget.id] === false) {
      event.preventDefault()
      event.currentTarget.classList.remove('facingDown')
      event.currentTarget.classList.add('flagged')
      flaggedArr[event.currentTarget.id] = true
    } else {
      event.preventDefault()
      event.currentTarget.classList.remove('flagged')
      event.currentTarget.classList.add('facingDown')
      flaggedArr[event.currentTarget.id] = false
    }
  })
})


//! Left click

cellsArr.forEach((cell) => {
  cell.addEventListener('click', (event) => {
    console.log(event)
  })
})
