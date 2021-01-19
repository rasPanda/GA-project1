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
let rightButton = false

//! Arrays

let cellsArr = []
let minesArr = []
let flaggedArr = []
let clearedArr = []

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
  minesLeft = 10
  minesCounter.innerHTML = minesLeft
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
      //? If cell is not revealed
      if (clearedArr[(parseInt(event.currentTarget.id))] === false) {
        //? If cell is flagged
        if (flaggedArr[(parseInt(event.currentTarget.id))] === true && event.button === 0) {
          return
        } else if (flaggedArr[(parseInt(event.currentTarget.id))] === true && event.button === 2) {
          flagCell((parseInt(event.currentTarget.id)))
          //? If cell is not flagged
        } else if (event.button === 0 && rightButton === false) {
          leftButton = true
          mouseDownCovered((parseInt(event.currentTarget.id)))
        } else if (event.button === 2 && leftButton === false) {
          rightButton = true
          flagCell((parseInt(event.currentTarget.id)))
        } else if (event.button === 2 && leftButton === true) {
          rightButton = true
          mouseDownDoubleCovered((parseInt(event.currentTarget.id)))
        }
        smileyButton.classList.remove('smiley')
        smileyButton.classList.add('smileyooh')
        //? If cell is revealed
      } else if (clearedArr[(parseInt(event.currentTarget.id))] === true) {
        if (event.button === 0 && rightButton === false) {
          leftButton = true
        } else if (event.button === 2 && leftButton === false) {
          rightButton = true
        } else if ((event.button === 2 && leftButton === true) || (event.button === 0 && rightButton === true)) {
          leftButton = true
          rightButton = true
          mouseDownDoubleRevealed((parseInt(event.currentTarget.id)))
        }

        //! Smiley
        smileyButton.classList.remove('smiley')
        smileyButton.classList.add('smileyooh')
      }
    })
  })
  cellsArr.forEach((cell) => {
    cell.addEventListener('mouseup', (event) => {
      //? If cell is not revealed
      if (clearedArr[(parseInt(event.currentTarget.id))] === false) {
        if (event.button === 0 && leftButton === true && rightButton === true) {
          leftButton = false
          rightButton = false
          mouseUpCovered((parseInt(event.currentTarget.id)))
          mouseUpDoubleCovered((parseInt(event.currentTarget.id)))
        } else if (event.button === 2 && leftButton === true && rightButton === true) {
          leftButton = false
          rightButton = false
          mouseUpCovered((parseInt(event.currentTarget.id)))
          mouseUpDoubleCovered((parseInt(event.currentTarget.id)))
        } else if (event.button === 2) {
          rightButton = false
        } else if (event.button === 0 && leftButton !== false) {
          leftButton = false
          revealCell((parseInt(event.currentTarget.id)))
        }

        //! Smiley
        smileyButton.classList.remove('smileyooh')
        smileyButton.classList.add('smiley')


        //? If cell is revealed
      } else if (clearedArr[(parseInt(event.currentTarget.id))] === true) {
        if (leftButton === true && rightButton === true) {
          leftButton = false
          rightButton = false
          mouseUpDoubleRevealed((parseInt(event.currentTarget.id)))

          //? If cell is flagged incorrectly
          const neighbours = createNeighboursArr((parseInt(event.currentTarget.id)))
          const uncoveredNeighbours = []
          for (let index = 0; index < neighbours.length; index++) {
            if (clearedArr[neighbours[index]] === false) {
              uncoveredNeighbours.push(neighbours[index])
            }
          }
          // console.log(neighbours)
          // const neighboursFlagged = []
          // for (let index = 0; index < neighbours.length; index++) {
          //   neighboursFlagged = 

          // }

          for (let index = 0; index < uncoveredNeighbours.length; index++) {
            if (flaggedArr[uncoveredNeighbours[index]] === true && (flaggedArr[uncoveredNeighbours[index]] !== minesArr[uncoveredNeighbours[index]])) {
              const wrongCells = []
              console.log('wrong flag!')
              console.log(uncoveredNeighbours)
              // console.log(minesArr[neighbours[index]])
              // console.log(flaggedArr[neighbours[index]])
              // console.log(neighbours[index])
              // wrongCells.push(neighbours[index])
              // // cellsArr[neighbours[index]].classList.remove('flagged')
              // // cellsArr[neighbours[index]].classList.add('bombwrong')
              // endGameRevealed(wrongCells)
            } else if (flaggedArr[uncoveredNeighbours[index]] === true && (flaggedArr[uncoveredNeighbours[index]] === minesArr[uncoveredNeighbours[index]])) {
              // console.log('doing nothing, correct flags!')
              return
            } else if (minesArr[uncoveredNeighbours[index]] === true) {
              // console.log('mines nearby!')
              return
            } else {
              // console.log('no mines!')
              revealCell(uncoveredNeighbours[index])
            }
          }
        } else if (event.button === 0) {
          leftButton = false
        } else if (event.button === 2) {
          rightButton = false
        }

        //! Smiley
        smileyButton.classList.remove('smileyooh')
        smileyButton.classList.add('smiley')

        //! Win condition
        // if () {

        // }
      }

      //! Clock
      if (timerInt) {
        return
      } else
        clock.innerHTML = 1
      timerInt = setInterval(() => {
        clock.innerHTML++
      }, 1000)
    })
  })
  cellsArr.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
  })
}





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

function endGame(cellId) {
  for (let index = 0; index < cellsArr.length; index++) {
    if (minesArr[index] === true && flaggedArr[index] === false) {
      cellsArr[index].classList.remove('facingDown')
      cellsArr[index].classList.add('revealed', 'mine')
    }
  }
  cellsArr[cellId].classList.remove('revealed', '_0')
  cellsArr[cellId].classList.add('minedead')
  for (let index = 0; index < flaggedArr.length; index++) {
    if (flaggedArr[index] === true && (flaggedArr[index] !== minesArr[index])) {
      cellsArr[index].classList.remove('flagged')
      cellsArr[index].classList.add('minewrong')
    }
  }
  clearInterval(timerInt)
  smileyButton.classList.remove('smiley')
  smileyButton.classList.add('smileydead')
}


function winGame() {

}

//! Smiley Button + Reset game

smileyButton.addEventListener('mousedown', (event) => {
  smileyButton.classList.remove('smiley', 'smileydead')
  smileyButton.classList.add('smileydown')
})

smileyButton.addEventListener('mouseup', (event) => {
  smileyButton.classList.remove('smileydown')
  smileyButton.classList.add('smiley')
  clearInterval(timerInt)
  timerInt = 0
  clock.innerHTML = 0
  while (setupGrid.hasChildNodes()) {
    setupGrid.removeChild(setupGrid.lastChild)
  }
  cellsArr = []
  minesArr = []
  flaggedArr = []
  clearedArr = []
  setUpGame()
})

//! Mouse up/down

function mouseDownCovered(cellId) {
  cellsArr[cellId].classList.remove('facingDown')
  cellsArr[cellId].classList.add('_0')
}

function mouseUpCovered(cellId) {
  cellsArr[cellId].classList.remove('_0')
  cellsArr[cellId].classList.add('facingDown')
}

function mouseDownDoubleCovered(cellId) {
  const neighbours = createNeighboursArr(cellId)
  for (let index = 0; index < neighbours.length; index++) {
    cellsArr[neighbours[index]].classList.add('_0')
  }
}

function mouseUpDoubleCovered(cellId) {
  const neighbours = createNeighboursArr(cellId)
  for (let index = 0; index < neighbours.length; index++) {
    cellsArr[neighbours[index]].classList.remove('_0')
    cellsArr[neighbours[index]].classList.add('facingDown')
  }
}

function mouseDownDoubleRevealed(cellId) {
  const neighbours = createNeighboursArr(cellId)
  for (let index = 0; index < neighbours.length; index++) {
    if (clearedArr[neighbours[index]] === false) {
      if (flaggedArr[neighbours[index]] === false) {
        cellsArr[neighbours[index]].classList.remove('facingDown')
        cellsArr[neighbours[index]].classList.add('_0')
      }
    }
  }
}

function mouseUpDoubleRevealed(cellId) {
  const neighbours = createNeighboursArr(cellId)
  for (let index = 0; index < neighbours.length; index++) {
    if (clearedArr[neighbours[index]] === false) {
      cellsArr[neighbours[index]].classList.remove('_0')
      cellsArr[neighbours[index]].classList.add('facingDown')
    }
  }
}

//! Reveal the covered cell (direct click)

function revealCell(cellId) {
  const neighbours = createNeighboursArr(cellId)
  const numOfMinesInNeighbours = countNeighbours(neighbours)
  if (clearedArr[cellId] === true) {
    return
  } else {
    if (flaggedArr[cellId] === true) {
      return
    } else if (minesArr[cellId] === true) {
      endGame(cellId)
    } else if (numOfMinesInNeighbours === 0) {
      if (clearedArr[cellId] === false) {
        cellsArr[cellId].classList.add('_0')
        clearedArr[cellId] = true
        for (let index = 0; index < neighbours.length; index++) {
          revealCell(neighbours[index])
        }
      }
    } else {
      cellsArr[cellId].classList.remove('facingDown')
      cellsArr[cellId].classList.add(`_${numOfMinesInNeighbours}`)
      clearedArr[cellId] = true
    }
  }
}


//! Flag the cell

function flagCell(cellId) {
  if (clearedArr[cellId] === true) {
    return
  } else if (flaggedArr[cellId] === false) {
    cellsArr[cellId].classList.remove('facingDown')
    cellsArr[cellId].classList.add('flagged')
    flaggedArr[cellId] = true
    minesLeft--
    minesCounter.innerHTML = minesLeft
  } else {
    cellsArr[cellId].classList.remove('flagged')
    cellsArr[cellId].classList.add('facingDown')
    flaggedArr[cellId] = false
    minesLeft++
    minesCounter.innerHTML = minesLeft
  }
}

//! Reveal the covered neighbours

function revealCoveredNeighbours(cellId) {
  if (clearedArr[cellId] === true) {
    return
  } else {
    console.log('working on it!')
  }
}


