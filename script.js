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

  if (window.PointerEvent) {
    console.log("Pointer Events is supported!");
    // Use o código da API Pointer Events aqui
  } else {
    console.log("Pointer Events is not supported.");
    // Use métodos alternativos para obter a posição do mouse (ex: eventos de mouse)
  }
  conteiner.setAttribute("class", "conteiner");
  document.body.appendChild(conteiner);

  let intervalID;

  document.addEventListener("mousedown", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    clearInterval(intervalID);

    intervalID = setInterval(() => trackMouse(conteiner), 5);
  });

  document.addEventListener("mouseup", () => {
    clearInterval(intervalID);
  });

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      getRandomColor();
    }
  });
};