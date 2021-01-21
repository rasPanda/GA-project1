//! DOM elements

const main = document.getElementById('main')
const setupGrid = document.getElementById('grid')
const smileyButton = document.getElementById('smiley')
const mineshundreds = document.getElementById('mineshundreds')
const minestens = document.getElementById('minestens')
const minesones = document.getElementById('minesones')
const clockhundreds = document.getElementById('clockhundreds')
const clocktens = document.getElementById('clocktens')
const clockones = document.getElementById('clockones')
const newGameButton = document.getElementById('newgame')
const difficulty = document.getElementById('difficulty')
const howToButton = document.getElementById('howtoplay')
const howToDiv = document.getElementById('howtodiv')
const beginnerboard = document.getElementById('beginnerboard')
const intermediateboard = document.getElementById('intermediateboard')
const expertboard = document.getElementById('expertboard')

//! Variables

let beginnerScores = []
let intermediateScores = []
let expertScores = []
let width = 9
let height = 9
let minesToSet = 10
let minesLeft = 10
let timerInt = 0
let clockDisplay = 0
let leftButton = false
let rightButton = false

if (localStorage) {
  beginnerScores = JSON.parse(localStorage.getItem('beginnerHighScores')) || []
  intermediateScores = JSON.parse(localStorage.getItem('intermediateHighScores')) || []
  expertScores = JSON.parse(localStorage.getItem('expertHighScores')) || []
  orderAndDisplayScores()
}

//! Arrays

let cellsArr = []
let minesArr = []
let flaggedArr = []
let clearedArr = []
let winningArr = []


//* Functions

//! How to button
howToButton.addEventListener('click', (event) => howToDiv.style.display = howToDiv.style.display === 'none' ? '' : 'none')


//! New Game Button
newGameButton.addEventListener('click', (event) => {
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
          const coveredNeighboursWithMinesAndFlags = []

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
            if (flaggedArr[coveredNeighbours[index]] === true && minesArr[coveredNeighbours[index]] === true) {
              coveredNeighboursWithMinesAndFlags.push(coveredNeighbours[index])
            }
          }

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
      }

      //! Smiley
      smileyButton.classList.remove('smileyooh')
      smileyButton.classList.add('smiley')

      //! Win condition
      if (winGame() === true) {
        smileyButton.classList.remove('smiley')
        smileyButton.classList.add('smileywin')
        clearInterval(timerInt)
        cellsArr = []
        scoreBoard()
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

  //! Mouseover
  cellsArr.forEach((cell) => {
    cell.addEventListener('mouseover', (event) => {
      //? Middle Click
      if (leftButton === true && rightButton === true) {
        mouseDownDoubleCovered((parseInt(event.currentTarget.id)))
        cellsArr[(parseInt(event.currentTarget.id))].classList.remove('facingDown')
        cellsArr[(parseInt(event.currentTarget.id))].classList.add('_0')
        //? Left Click
      } else if (leftButton === true) {
        mouseDownCovered((parseInt(event.currentTarget.id)))
      }
    })
  })

  //! Mouseout
  cellsArr.forEach((cell) => {
    cell.addEventListener('mouseout', (event) => {
      //? If cell is not revealed
      if (clearedArr[(parseInt(event.currentTarget.id))] === false) {
        //? Middle Click
        if (leftButton === true && rightButton === true) {
          mouseUpDoubleCovered((parseInt(event.currentTarget.id)))
          //? Left Click
        } else if (leftButton === true) {
          mouseUpCovered((parseInt(event.currentTarget.id)))
        }
      } else if (clearedArr[(parseInt(event.currentTarget.id))] === true) {
        if (leftButton === true && rightButton === true) {
          mouseUpDoubleRevealed((parseInt(event.currentTarget.id)))
        }
      }
    })
  })
}

//! Prevent right-click default
main.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})


//! If mouseleave of grid 
setupGrid.addEventListener('mouseleave', (event) => {
  if (leftButton === true) {
    leftButton === false
  }
  if (rightButton === true) {
    rightButton === false
  }
  smileyButton.classList.remove('smileyooh')
  smileyButton.classList.add('smiley')
})

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

//! Win Game check + Scoreboard

function winGame() {
  if (minesLeft === 0 && winningArr.every(cell => cell === true)) {
    return winningArr.every(cell => cell === true)
  }
}

function scoreBoard() {
  if (confirm(('Congrats on the win, your time made it on the scoreboard! Do you want to save your score?'))) {
    const newName = prompt('Great! What\'s your name?')
    const player = { name: newName, score: clockDisplay }
    switch (difficulty.value) {
      case 'beginner':
        beginnerScores.push(player)
        if (localStorage) {
          localStorage.setItem('beginnerHighScores', JSON.stringify(beginnerScores))
        }
        break
      case 'intermediate':
        intermediateScores.push(player)
        if (localStorage) {
          localStorage.setItem('intermediateHighScores', JSON.stringify(intermediateScores))
        }
        break
      case 'expert':
        expertScores.push(player)
        if (localStorage) {
          localStorage.setItem('expertHighScores', JSON.stringify(expertScores))
        }
        break
      default:
        break
    }
    orderAndDisplayScores()
  } else {
    return
  }
}

function orderAndDisplayScores() {

  const beginnerArr = beginnerScores.sort((playerA, playerB) => playerA.score - playerB.score).map(player => {
    return `<li><b>${player.name}</b> with a time of ${player.score}</li>`
  })
  beginnerboard.innerHTML = beginnerArr.join('')

  const intermediateArr = intermediateScores.sort((playerA, playerB) => playerA.score - playerB.score).map(player => {
    return `<li><b>${player.name}</b> with a time of ${player.score}</li>`
  })
  intermediateboard.innerHTML = intermediateArr.join('')

  const expertArr = expertScores.sort((playerA, playerB) => playerA.score - playerB.score).map(player => {
    return `<li><b>${player.name}</b> with a time of ${player.score}</li>`
  })
  expertboard.innerHTML = expertArr.join('')

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
  minesLeft = minesToSet
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
  if (clockDisplay <= 999) {
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


