const play = document.getElementById('play');
const high = document.getElementById('high-score');
const levelDisplay = document.getElementById('level');
const board = document.querySelector('.board');
const info = document.getElementById('info');
const tiles = ["green", "red", "blue", "yellow"];

let pattern = [];
let userPattern = [];
let level;
let highScore = 0;

const audioFiles = {
  green: './sounds/green.mp3',
  red: './sounds/red.mp3',
  blue: './sounds/blue.mp3',
  yellow: './sounds/yellow.mp3',
  gameOver: './sounds/game-over.wav',
  gameWin: './sounds/game-win.wav'
};
const audios = {};

Object.keys(audioFiles).forEach(key => {
  audios[key] = new Audio(audioFiles[key]);
});

play.addEventListener('click', startGame);
board.addEventListener('click', (event) => {
  const { tile } = event.target.dataset;
  if (tile) handleClick(tile);
});

function startGame() {
  play.classList.add('hidden');
  info.innerText = 'Focus!';
  level = 0;
  nextLevel();
}

function nextLevel() {
  level+=1;
  userPattern = [];
  board.classList.add('unclickable');
  info.innerText = 'Watch the pattern!';
  levelDisplay.innerText = level;
  if (highScore < level) {
    highScore = level;
    high.innerText = highScore;
  }
  
  pattern.push(getRandomColor());
  playPattern(pattern);

  setTimeout(() => {
    userTurn();
  }, (pattern.length * 700) + 200);
}

function getRandomColor() {
  const randomColor = tiles[Math.floor(Math.random() * 4)];
  return randomColor;
}

function playPattern(pattern) {
  pattern.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, index * 700);
  });
}
function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`);
  const sound = audios[color];

  tile.classList.remove('inactive');
  sound.play();

  setTimeout(() => {
    tile.classList.add('inactive');
  }, 300);
}
function userTurn() {
  board.classList.remove('unclickable');
  info.innerText = 'Your turn!';
}

function handleClick(tile) {
  userPattern.push(tile);
  const sound = audios[tile];
  sound.play();

  for (let i = 0; i < userPattern.length; i++) {
    if (userPattern[i] !== pattern[i]) {
      resetGame();
      return;
    }
  }

  if (userPattern.length === pattern.length) {
    if (level === 12) {
      winGame();
    } else {
      info.innerText = "Keep it up!";
      setTimeout(nextLevel, 1300);
      return;
    }
  }
}

function resetGame() {
  const sound = audios['gameOver'];
  sound.play();

  if (highScore < level) {
    highScore = level;
  }

  pattern = [];
  userPattern = [];
  level = 0;

  play.classList.remove('hidden');
  board.classList.add('unclickable');

  info.innerText = "Game over!";
  high.innerText = highScore;
}

function winGame() {
  const sound = audios['gameWin'];
  sound.play();
  if (highScore < level) {
    highScore = level;
  }
  pattern = [];
  userPattern = [];
  level = 0;

  play.classList.remove('hidden');
  board.classList.add('unclickable');

  info.innerText = "Congrats.You won!";
  high.innerText = highScore;
}
