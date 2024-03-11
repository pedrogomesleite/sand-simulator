class MouseStop {
  constructor() {
    this.clientX;
    this.clientY;
  }
}

class Areia {
  constructor() {
    this.elementClass;
    this.x;
    this.y;
    this.element;
  }
}

const larguraViewport = window.innerWidth;
const alturaViewport = window.innerHeight;
const larguraCelula = 5;
const alturaCelula = 5;
const linhas = Math.floor(alturaViewport / alturaCelula) + 1;
const colunas = Math.floor(larguraViewport / larguraCelula) + 1;

let mouseX;
let mouseY;
let grid = [];
let count = 0;
let color = "blue";
let isMouseDown = false;
let conteiner = document.createElement("div");

for (let i = 0; i < linhas; i++) {
  grid[i] = [];
  for (let j = 0; j < colunas; j++) {
    grid[i][j] = false;
  }
}

function linhaOcupada(linha, coluna) {
  for (let i = linha; i < linhas; i++) {
    if (!estaOcupada(i, coluna)) {
      return false;
    }
  }
  return true;
}

function marcarOcupada(linha, coluna) {
  grid[linha][coluna] = true;
}

function marcarLivre(linha, coluna) {
  grid[linha][coluna] = false;
}

function estaOcupada(linha, coluna) {
  return grid[linha][coluna];
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const cssColorString = `rgb(${r}, ${g}, ${b})`;

  color = cssColorString;
}

let colorsGrid = [];

function getAllRgbColors() {

  for(let b = 0; b <= 255; b++) {
    colorsGrid.push(`rgb(255, 0, ${b})`);
  }
  for(let r = 255; r >= 0; r--) {
    colorsGrid.push(`rgb(${r}, 0, 255)`);
  }
  for(let g = 0; g <= 255; g++) {
    colorsGrid.push(`rgb(0, ${g}, 255)`);
  }
  for(let b = 255; b >= 0; b--) {
    colorsGrid.push(`rgb(0, 255, ${b})`);
  }
  for(let r = 0; r <= 255; r++) {
    colorsGrid.push(`rgb(${r}, 255, 0)`);
  }
  for(let g = 255; g >= 0; g--) {
    colorsGrid.push(`rgb(255, ${g}, 0)`);
  }
}

let h = 0;

function getLinearColor() {
  h = (h + 1) % colorsGrid.length;

  const cssColorString = colorsGrid[h];

  color = cssColorString;
}

function trackMouse(conteiner) {
  var columnIndex = Math.floor(mouseX / 5);
  var rowIndex = Math.floor(mouseY / 5);

  if (columnIndex > colunas || rowIndex > linhas) {
    return;
  }

  if (estaOcupada(rowIndex, columnIndex)) {
    return;
  }

  let grao = new Areia();
  grao.x = columnIndex;
  grao.y = rowIndex;
  grao.elementClass = `areia areia--${count}`;
  count = count + 1;
  let graoDiv = document.createElement("div");
  grao.element = graoDiv;
  graoDiv.setAttribute("class", grao.elementClass);
  graoDiv.style.backgroundColor = color;
  graoDiv.style.gridColumn = `${grao.x} / ${grao.x + 1}`;
  graoDiv.style.gridRow = `${grao.y} / ${grao.y + 1}`;
  conteiner.appendChild(graoDiv);
  marcarOcupada(grao.y, grao.x);

  let cont = 0;
  let intervalIDv = setInterval(() => verificar(grao, intervalIDv, cont), 5);
}

function verificar(grao, intervalID, cont) {
  if (grao.x == colunas - 1 || grao.y == linhas - 1) {
    marcarOcupada(grao.y, grao.x);
    clearInterval(intervalID);
  } else if (
    estaOcupada(grao.y + 1, grao.x) &&
    estaOcupada(grao.y + 1, grao.x - 1) &&
    estaOcupada(grao.y + 1, grao.x + 1) &&
    linhaOcupada(grao.y, grao.x)
  ) {
    if (cont === 10) {
      marcarOcupada(grao.y, grao.x);
      clearInterval(intervalID);
    }
    cont++;
  } else if (estaOcupada(grao.y + 1, grao.x) == false) {
    marcarLivre(grao.y, grao.x);
    grao.y = grao.y + 1;
    grao.element.style.gridRow = `${grao.y} / ${grao.y + 1}`;
    // return;
  } else if (estaOcupada(grao.y + 1, grao.x - 1) == false) {
    marcarLivre(grao.y, grao.x);
    grao.y = grao.y + 1;
    grao.x = grao.x - 1;
    grao.element.style.gridRow = `${grao.y} / ${grao.y + 1}`;
    grao.element.style.gridColumn = `${grao.x} / ${grao.x + 1}`;
    // return;
  } else if (estaOcupada(grao.y + 1, grao.x + 1) == false) {
    marcarLivre(grao.y, grao.x);
    grao.y = grao.y + 1;
    grao.x = grao.x + 1;
    grao.element.style.gridRow = `${grao.y} / ${grao.y + 1}`;
    grao.element.style.gridColumn = `${grao.x} / ${grao.x + 1}`;
    // return;
  }
  marcarOcupada(grao.y, grao.x);
}

window.onload = function () {
  getAllRgbColors();
  conteiner.setAttribute("class", "conteiner");
  document.body.appendChild(conteiner);

  if(larguraViewport < 1300) {
    setInterval(getLinearColor, 25);
  }  

  let intervalID;

  document.addEventListener("pointerdown", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    clearInterval(intervalID);

    intervalID = setInterval(() => trackMouse(conteiner), 5);
  });

  document.addEventListener("pointerup", () => {
    clearInterval(intervalID);
  });

  document.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    console.log(`${mouseX}, ${mouseY}`);
  });

  document.addEventListener("touchmove", (event) => {
    for(let touch of event.touches) {
      mouseX = touch.clientX;
      mouseY = touch.clientY;
    }
  });

  document.addEventListener("touchend", () => {
    clearInterval(intervalID);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      getRandomColor();
    }
  });
};