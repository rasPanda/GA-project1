//! DOM elements

const setupGrid = document.getElementById('grid')
// const gameGrid = Array.from(document.getElementById('grid'))
// console.log(gameGrid)

//! Variables

let width = 9
let height = 9
let minesToSet = 10
let minesLeft = 10

//! Arrays

const cellsArr = []
const minesArr = []
const flaggedArr = []

console.log(cellsArr)
console.log(minesArr)
console.log(flaggedArr)



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


function createFlaggedArr() {
  for (let index = 0; index < cellsArr.length; index++) {
    flaggedArr.push(false)
  }
}


function createEventListeners() {
  cellsArr.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      leftClick((parseInt(event.currentTarget.id)))
    })
  })
  cellsArr.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      rightClick(event)
    })
  })
  // cellsArr.forEach((cell) => {
  //   cell.addEventListener('mousedown contextmenu', (event) => {
  //     event.preventDefault()
  //     middleClick(event)
  //     console.log(event)
  //   })
  // })
}


function countNeighbours(cellId) {
  const neighbourArr = createNeighboursArr(cellId)
  const numOfMinesArr = []
  for (let index = 0; index < neighbourArr.length; index++) {
    numOfMinesArr.push(minesArr[neighbourArr[index]])
  }
  return numOfMinesArr.filter(x => x).length
}

// function countNeighbours (neighbourArr) {
//   // const neighbours = []
//   console.log(neighbourArr) 
// }

function createNeighboursArr(cellId) {
  if (cellId === 0) {
    // console.log('top left!')
    return [1, parseInt(width), (width + 1)]
  } else if (cellId === width - 1) {
    // console.log('top right!')
    return [(width - 2), (width * 2 - 2), (width * 2 - 1)]
  } else if (cellId === width * height - 1) {
    // console.log('bottom right!')
    return [(width * height - 2), (width * height - width - 2), (width * height - width - 1)]
  } else if (cellId === width * height - width) {
    // console.log('bottom left!')
    return [(width * height - width + 1), (width * height - width * 2), (width * height - width * 2 + 1)]
  } else if (cellId < width) {
    // console.log('top row!')
    return [(cellId - 1), (cellId + 1), (cellId + width - 1), (cellId + width), (cellId + width + 1)]
  } else if (cellId % width === 0) {
    // console.log('left row!')
    return [(cellId - width), (cellId - width + 1), (cellId + 1), (cellId + width), (cellId + width + 1)]
  } else if ((cellId + width) >= width * height) {
    // console.log('bottom row!')
    return [(cellId - width - 1), (cellId - width), (cellId - width + 1), (cellId - 1), (cellId + 1)]
  } else if (cellId % width === width - 1) {
    // console.log('right row!')
    return [(cellId - width - 1), (cellId - width), (cellId - 1), (cellId + width - 1), (cellId + width)]
  } else {
    // console.log('middle!')
    return [(cellId - width - 1), (cellId - width), (cellId - width + 1), (cellId - 1), (cellId + 1), (cellId + width - 1), (cellId + width), (cellId + width + 1)]
  }
}

//! Check neighbours




//! End Game

function endGame() {
  alert('GAME OVER')
}


//! Left click

function leftClick(cellId) {
  if (flaggedArr[cellId] === true) {
    return
  } else if (minesArr[cellId] === true) {
    console.log('mine!')
    for (let index = 0; index < cellsArr.length; index++) {
      if (minesArr[index] === true) {
        cellsArr[index].classList.remove('facingDown')
        cellsArr[index].classList.add('revealed', 'mine')
      }
    }
    cellsArr[cellId].classList.remove('revealed')
    cellsArr[cellId].classList.add('dead')
    // endGame()
  } else {
    if ((countNeighbours(cellId)) === 0) {
      cellsArr[cellId].classList.add('_0')


      const neighbours = createNeighboursArr(cellId)
      for (let index = 0; index < neighbours.length; index++) {
        leftClick(neighbours[index])
        // console.log(neighbours[index])
        // console.log(cellsArr[neighbours[index]])
      }




    } else {
      cellsArr[cellId].classList.remove('facingDown')
      cellsArr[cellId].classList.add(`_${(countNeighbours(cellId))}`)
    }
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


//! Set up the game

setTimeout(() => {
  createGrid()
  setMines()
  createFlaggedArr()
  createEventListeners()
}, 1)
