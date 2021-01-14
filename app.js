//! DOM elements

const grid = document.getElementById('grid')

//! Variables

let width = 9
let height = 9

//! Arrays

const cells = []
const mines = []
const flagged = []

//! Functions
function revealCell () {

}



//! Creating the grid!

for (let index = 0; index < width * height; index++) {
  // ? Generate each element
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
  // ? Number each cell by its index.
  cell.innerHTML = index
  cell.setAttribute('id', index)
  // ? Set the width and height of grid
  if (width <= 16) {
    grid.style.width = `${25 * width}px`
    grid.style.height = `${25 * height}px`
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / height}%`
  } else {
    grid.style.width = `${25 * width}px`
    grid.style.height = '400px'
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / height}%`
  }
  cell.setAttribute('class', 'covered')
}

console.log(cells)

cells.forEach((cell) => {
  cell.addEventListener('click', (event) => {
    console.log(event.currentTarget.id)
  })
})
