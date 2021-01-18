//! DOM elements

const setupGrid = document.getElementById('grid')
// const gameGrid = Array.from(document.getElementById('grid'))
// console.log(gameGrid)
const smileyButton = document.getElementById('smiley')
const minesCounter = document.getElementById('minesleft')
const clock = document.getElementById('clock')

//! Variables

let width = 9
let height = 9
let minesToSet = 10
let minesLeft = 10
let timerInt = 0
let leftButton = false

//! Arrays

const cellsArr = []
const minesArr = []
const flaggedArr = []
const clearedArr = []

console.log(cellsArr)
console.log(minesArr)
console.log(flaggedArr)



//! Functions

//! Set up the game

function setUpGame() {
  createGrid()
  setMines()
  createFlaggedArr()
  createClearedArr()
  createEventListeners()
}


setTimeout(() => {
  setUpGame()
}, 1)


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


function createFlaggedArr() {
  for (let index = 0; index < cellsArr.length; index++) {
    flaggedArr.push(false)
  }
}

function createClearedArr() {
  for (let index = 0; index < cellsArr.length; index++) {
    clearedArr.push(false)
  }
}

function createEventListeners() {
  cellsArr.forEach((cell) => {
    cell.addEventListener('mousedown', (event) => {
      mouseDown((parseInt(event.currentTarget.id)))
      leftButton = true
    })
  })
  cellsArr.forEach((cell) => {
    cell.addEventListener('mouseup', (event) => {
      leftButton = false
      leftClick((parseInt(event.currentTarget.id)))
    })
  })
  cellsArr.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      if (leftButton = false) {
        rightClick(event)
      } else {
        middleClick(event)
      }
    })
  })
  // cellsArr.forEach((cell) => {
  //   cell.addEventListener('mousedown', (event) => {
  //     event.preventDefault()
  //     middleClick(event)
  //     console.log(event)
  //   })
  // })
}


//! Clock


// if (timerInt) return
// timerInt = setInterval(() => {
//   clock.innerHTML += 1
// }, 1000)


//! Check neighbours


function countNeighbours(neighbourArr) {
  const numOfMinesArr = []
  for (let index = 0; index < neighbourArr.length; index++) {
    numOfMinesArr.push(minesArr[neighbourArr[index]])
  }
  return numOfMinesArr.filter(x => x).length
}


function createNeighboursArr(cellId) {
  if (cellId === 0) {
    return [1, parseInt(width), (width + 1)]
  } else if (cellId === width - 1) {
    return [(width - 2), (width * 2 - 2), (width * 2 - 1)]
  } else if (cellId === width * height - 1) {
    return [(width * height - 2), (width * height - width - 2), (width * height - width - 1)]
  } else if (cellId === width * height - width) {
    return [(width * height - width + 1), (width * height - width * 2), (width * height - width * 2 + 1)]
  } else if (cellId < width) {
    return [(cellId - 1), (cellId + 1), (cellId + width - 1), (cellId + width), (cellId + width + 1)]
  } else if (cellId % width === 0) {
    return [(cellId - width), (cellId - width + 1), (cellId + 1), (cellId + width), (cellId + width + 1)]
  } else if ((cellId + width) >= width * height) {
    return [(cellId - width - 1), (cellId - width), (cellId - width + 1), (cellId - 1), (cellId + 1)]
  } else if (cellId % width === width - 1) {
    return [(cellId - width - 1), (cellId - width), (cellId - 1), (cellId + width - 1), (cellId + width)]
  } else {
    return [(cellId - width - 1), (cellId - width), (cellId - width + 1), (cellId - 1), (cellId + 1), (cellId + width - 1), (cellId + width), (cellId + width + 1)]
  }
}




//! End Game

function endGame() {
  alert('GAME OVER')
}


//! Left click

function mouseDown(cellId) {
  const neighbours = createNeighboursArr(cellId)
  cellsArr[cellId].classList.remove('facingDown')
  cellsArr[cellId].classList.add('_0')
  // for (let index = 0; index < neighbours.length; index++) {
  //   cellsArr[neighbours[index]].classList.remove('facingDown')
  //   cellsArr[neighbours[index]].classList.add('_0')
  // }
}

function leftClick(cellId) {
  const neighbours = createNeighboursArr(cellId)
  const numOfMinesInNeighbours = countNeighbours(neighbours)
  // for (let index = 0; index < neighbours.length; index++) {
  //   cellsArr[neighbours[index]].classList.remove('_0')
  //   cellsArr[neighbours[index]].classList.add('facingDown')
  // }
  if (flaggedArr[cellId] === true) {
    return
  } else if (minesArr[cellId] === true) {
    for (let index = 0; index < cellsArr.length; index++) {
      if (minesArr[index] === true) {
        cellsArr[index].classList.remove('facingDown')
        cellsArr[index].classList.add('revealed', 'mine')
      }
    }
    cellsArr[cellId].classList.remove('revealed')
    cellsArr[cellId].classList.add('dead')
    endGame()
  } else if (numOfMinesInNeighbours === 0) {
    if (clearedArr[cellId] === false) {
      cellsArr[cellId].classList.add('_0')
      clearedArr[cellId] = true
      for (let index = 0; index < neighbours.length; index++) {
        leftClick(neighbours[index])
      }
    }
  } else {
    cellsArr[cellId].classList.remove('facingDown')
    cellsArr[cellId].classList.add(`_${numOfMinesInNeighbours}`)
    clearedArr[cellId] = true
  }
}


//! Right click

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

//! Middle click

function middleClick(event) {
  console.log('middle click!')
}


