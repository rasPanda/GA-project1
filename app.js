//! DOM elements

const setupGrid = document.getElementById('grid')
const smileyButton = document.getElementById('smiley')
// const minesCounter = document.getElementById('minesleft')
// const clock = document.getElementById('clock')
const mineshundreds = document.getElementById('mineshundreds')
const minestens = document.getElementById('minestens')
const minesones = document.getElementById('minesones')
const clockhundreds = document.getElementById('clockhundreds')
const clocktens = document.getElementById('clocktens')
const clockones = document.getElementById('clockones')
const newGameButton = document.getElementById('newgame')
const difficulty = document.getElementById('difficulty')

//! Variables

let width = 9
let height = 9
let minesToSet = 10
let minesLeft = 10
let timerInt = 0
let clockDisplay = 0
let leftButton = false
let rightButton = false

//! Arrays

let cellsArr = []
let minesArr = []
let flaggedArr = []
let clearedArr = []
let winningArr = []

// console.log(cellsArr)
// console.log(minesArr)
// console.log(flaggedArr)



//* Functions

//! New Game Button
newGameButton.addEventListener('click', (event) => {
  console.log('click')
  switch (difficulty.value) {
    case 'beginner':
      resetGame()
      width = 9
      height = 9
      minesLeft = 10
      minesToSet = 10
      setUpGame()
      break
    case 'intermediate':
      resetGame()
      width = 16
      height = 16
      minesLeft = 40
      minesToSet = 40
      setUpGame()
      break
    case 'expert':
      resetGame()
      width = 30
      height = 16
      minesLeft = 99
      minesToSet = 99
      setUpGame()
      break
    default:
      break
  }
})


//! Set up the game

function setUpGame() {
  createGrid()
  setMines()
  createFlaggedArr()
  createClearedArr()
  createWinningArr()
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
    // cell.innerHTML = index
    cell.setAttribute('id', index)
    // ? Set the width and height of grid
    if (width <= 16) {
      setupGrid.style.width = `${20 * width}px`
      setupGrid.style.height = `${20 * height}px`
      cell.style.width = `${100 / width}%`
      cell.style.height = `${100 / height}%`
    } else {
      setupGrid.style.width = `${20 * width}px`
      setupGrid.style.height = '320px'
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
  mineshundreds.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  minestens.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  minesones.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  mineshundreds.classList.add(`time${Math.floor((minesLeft / 100) % 10)}`)
  minestens.classList.add(`time${Math.floor((minesLeft / 10) % 10)}`)
  minesones.classList.add(`time${Math.floor(minesLeft % 10)}`)
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

function createWinningArr() {
  for (let index = 0; index < cellsArr.length; index++) {
    winningArr.push(false)
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
          smileyButton.classList.remove('smiley')
          smileyButton.classList.add('smileyooh')
        } else if (event.button === 2 && leftButton === false) {
          rightButton = true
          flagCell((parseInt(event.currentTarget.id)))
        } else if (event.button === 2 && leftButton === true) {
          rightButton = true
          mouseDownDoubleCovered((parseInt(event.currentTarget.id)))
          smileyButton.classList.remove('smiley')
          smileyButton.classList.add('smileyooh')
        }
        //? If cell is revealed
      } else if (clearedArr[(parseInt(event.currentTarget.id))] === true) {
        if (event.button === 0 && rightButton === false) {
          leftButton = true
          smileyButton.classList.remove('smiley')
          smileyButton.classList.add('smileyooh')
        } else if (event.button === 2 && leftButton === false) {
          rightButton = true
        } else if ((event.button === 2 && leftButton === true) || (event.button === 0 && rightButton === true)) {
          leftButton = true
          rightButton = true
          mouseDownDoubleRevealed((parseInt(event.currentTarget.id)))
          smileyButton.classList.remove('smiley')
          smileyButton.classList.add('smileyooh')
        }
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
          smileyButton.classList.remove('smileyooh')
          smileyButton.classList.add('smiley')
        } else if (event.button === 2 && leftButton === true && rightButton === true) {
          leftButton = false
          rightButton = false
          mouseUpCovered((parseInt(event.currentTarget.id)))
          mouseUpDoubleCovered((parseInt(event.currentTarget.id)))
          smileyButton.classList.remove('smileyooh')
          smileyButton.classList.add('smiley')
        } else if (event.button === 2) {
          rightButton = false
        } else if (event.button === 0 && leftButton !== false) {
          leftButton = false
          revealCell((parseInt(event.currentTarget.id)))
          smileyButton.classList.remove('smileyooh')
          smileyButton.classList.add('smiley')
        }




        //? If cell is revealed
      } else if (clearedArr[(parseInt(event.currentTarget.id))] === true) {
        if (leftButton === true && rightButton === true) {
          leftButton = false
          rightButton = false
          mouseUpDoubleRevealed((parseInt(event.currentTarget.id)))
          smileyButton.classList.remove('smileyooh')
          smileyButton.classList.add('smiley')

          //? Create array of neighbours which are covered
          const neighbours = createNeighboursArr((parseInt(event.currentTarget.id)))
          const coveredNeighbours = []
          for (let index = 0; index < neighbours.length; index++) {
            if (clearedArr[neighbours[index]] === false) {
              coveredNeighbours.push(neighbours[index])
            }
          }

          //? create array of neighbours w/wo mines + arrays of neighbours w/wo flags
          const coveredNeighboursWithMines = []
          const coveredNeighboursNoMines = []
          const coveredNeighboursWithFlags = []
          // const coveredNeighboursNoFlags = []
          const coveredNeighboursWithMinesAndFlags = []
          // const coveredNeighboursNoMinesAndFlags = []

          for (let index = 0; index < coveredNeighbours.length; index++) {
            if (minesArr[coveredNeighbours[index]] === true) {
              coveredNeighboursWithMines.push(coveredNeighbours[index])
            }
            if (minesArr[coveredNeighbours[index]] === false) {
              coveredNeighboursNoMines.push(coveredNeighbours[index])
            }
            if (flaggedArr[coveredNeighbours[index]] === true) {
              coveredNeighboursWithFlags.push(coveredNeighbours[index])
            }
            // if (flaggedArr[coveredNeighbours[index]] === false) {
            //   coveredNeighboursNoFlags.push(coveredNeighbours[index])
            // }
            if (flaggedArr[coveredNeighbours[index]] === true && minesArr[coveredNeighbours[index]] === true) {
              coveredNeighboursWithMinesAndFlags.push(coveredNeighbours[index])
            }
            // if (flaggedArr[coveredNeighbours[index]] === false && minesArr[coveredNeighbours[index]] === false) {
            //   coveredNeighboursNoMinesAndFlags.push(coveredNeighbours[index])
            // }
          }

          // console.log(`covered neighour arr: ${coveredNeighbours}`)
          // console.log(`coveredNeighboursWithMines ${coveredNeighboursWithMines}`)
          // console.log(`coveredNeighboursNoMines ${coveredNeighboursNoMines}`)
          // console.log(`coveredNeighboursWithFlags ${coveredNeighboursWithFlags}`)
          // console.log(`coveredNeighboursNoFlags ${coveredNeighboursNoFlags}`)
          // console.log(`coveredNeighboursWithMinesAndFlags ${coveredNeighboursWithMinesAndFlags}`)
          // console.log(`coveredNeighboursNoMinesAndFlags ${coveredNeighboursNoMinesAndFlags}`)

          //? Check if there are any wrong flags. If yes, end game.
          if (coveredNeighboursWithMines.length > 0 && coveredNeighboursWithFlags.length > 0 && coveredNeighboursWithMinesAndFlags.toString() !== coveredNeighboursWithFlags.toString()) {
            for (let index = 0; index < coveredNeighboursWithMines.length; index++) {
              cellsArr[coveredNeighboursWithMines[index]].classList.add('minedead')
            }
            endGame(coveredNeighboursWithFlags[0])
            //? If all flags are correct, and there are no mines in the covered neighbours, reveal neighbours.
          } else if (coveredNeighboursNoMines.length > 0 && coveredNeighboursWithMinesAndFlags.toString() === coveredNeighboursWithMines.toString() && coveredNeighboursWithMinesAndFlags.toString() === coveredNeighboursWithFlags.toString()) {
            for (let index = 0; index < coveredNeighboursNoMines.length; index++) {
              revealCell(coveredNeighboursNoMines[index])
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
        if (minesLeft === 0) {
          if (winGame() === true) {
            console.log('win!')
            smileyButton.classList.remove('smiley')
            smileyButton.classList.add('smileywin')
            clearInterval(timerInt)
            cellsArr = []
          }
        }
      }

      //! Clock display
      if (timerInt) {
        return
      } else {
        clockDisplay = 1
        clockones.classList.add(`time${Math.floor(clockDisplay % 10)}`)
      }
      timerInt = setInterval(() => {
        clockDisplay++
        updateClockDisplay()
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
  cellsArr = []
}


function winGame() {
  return winningArr.every(cell => cell === true)
}

//! Smiley Button + Reset game

smileyButton.addEventListener('mousedown', (event) => {
  smileyButton.classList.remove('smiley', 'smileydead', 'smileywin')
  smileyButton.classList.add('smileydown')
})

smileyButton.addEventListener('mouseup', (event) => {
  smileyButton.classList.remove('smileydown')
  smileyButton.classList.add('smiley')

  resetGame()

  setUpGame()
})

function resetGame() {
  clearInterval(timerInt)
  timerInt = 0
  clockDisplay = 0
  minesLeft = 10
  while (setupGrid.hasChildNodes()) {
    setupGrid.removeChild(setupGrid.lastChild)
  }
  cellsArr = []
  minesArr = []
  flaggedArr = []
  clearedArr = []
  winningArr = []

  clockhundreds.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  clocktens.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  clockones.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  clockones.classList.add('time0')
  clocktens.classList.add('time0')
  clockhundreds.classList.add('time0')

  mineshundreds.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  minestens.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  minesones.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
  mineshundreds.classList.add(`time${Math.floor((minesLeft / 100) % 10)}`)
  minestens.classList.add(`time${Math.floor((minesLeft / 10) % 10)}`)
  minesones.classList.add(`time${Math.floor(minesLeft % 10)}`)
}

//! Clock display

function updateClockDisplay() {
  if (clockDisplay < 999) {
    clockhundreds.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    clockhundreds.classList.add(`time${Math.floor((clockDisplay / 100) % 10)}`)
    clocktens.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    clocktens.classList.add(`time${Math.floor((clockDisplay / 10) % 10)}`)
    clockones.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    clockones.classList.add(`time${Math.floor(clockDisplay % 10)}`)
  } else {
    return
  }
}

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
        winningArr[cellId] = true
        for (let index = 0; index < neighbours.length; index++) {
          revealCell(neighbours[index])
        }
      }
    } else {
      cellsArr[cellId].classList.remove('facingDown')
      cellsArr[cellId].classList.add(`_${numOfMinesInNeighbours}`)
      clearedArr[cellId] = true
      winningArr[cellId] = true
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
    winningArr[cellId] = true
    minesLeft--
    mineshundreds.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    minestens.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    minesones.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    if (minesLeft < 0) {
      mineshundreds.classList.add('timeneg')
      minestens.classList.add(`time${Math.floor((Math.abs(minesLeft) / 10) % 10)}`)
      minesones.classList.add(`time${Math.floor(Math.abs(minesLeft) % 10)}`)
    } else {
      mineshundreds.classList.add(`time${Math.floor((minesLeft / 100) % 10)}`)
      minestens.classList.add(`time${Math.floor((minesLeft / 10) % 10)}`)
      minesones.classList.add(`time${Math.floor(minesLeft % 10)}`)
    }
  } else {
    cellsArr[cellId].classList.remove('flagged')
    cellsArr[cellId].classList.add('facingDown')
    flaggedArr[cellId] = false
    winningArr[cellId] = false
    minesLeft++
    mineshundreds.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    minestens.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    minesones.classList.remove('time0', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'timeneg')
    if (minesLeft < 0) {
      mineshundreds.classList.add('timeneg')
      minestens.classList.add(`time${Math.floor((Math.abs(minesLeft) / 10) % 10)}`)
      minesones.classList.add(`time${Math.floor(Math.abs(minesLeft) % 10)}`)
    } else {
      mineshundreds.classList.add(`time${Math.floor((minesLeft / 100) % 10)}`)
      minestens.classList.add(`time${Math.floor((minesLeft / 10) % 10)}`)
      minesones.classList.add(`time${Math.floor(minesLeft % 10)}`)
    }
  }
}


