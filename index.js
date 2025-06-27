const display = document.querySelector('.timer-display');
const button = document.getElementById('toggle-button');
const span = document.getElementById('toggle-text');
const clickSound = new Audio('assets/click.wav');

let totalSeconds = 0;
let timerInterval = null;
let isRunning = false;

function updateDisplay() {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  display.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (totalSeconds === 0) {
    timerInterval = setInterval(() => {
      totalSeconds++;
      if (totalSeconds >= 99 * 60) {
        totalSeconds = 99 * 60;
        clearInterval(timerInterval);
        isRunning = false;
        span.textContent = 'START';
      }
      updateDisplay();
    }, 1000);
  } else {
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateDisplay();
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        totalSeconds = 0;
        span.textContent = 'START';
        isRunning = false;
      }
    }, 1000);
  }
}

button.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(timerInterval);
    span.textContent = 'START';
  } else {
    startTimer();
    span.textContent = 'STOP';
  }
  isRunning = !isRunning;
});

let lastY = null;

display.addEventListener('mousedown', (e) => {
  lastY = e.clientY;

function onMouseMove(e) {
  const deltaY = e.clientY - lastY;

  if (Math.abs(deltaY) > 5 && !isRunning) {
    let minutes = Math.floor(totalSeconds / 60);

    if (deltaY < 0) {
      minutes = (minutes + 1) % 100;
    } else {
      minutes = (minutes - 1 + 100) % 100;
    }

    totalSeconds = minutes * 60;
    updateDisplay();
    clickSound.play();
    lastY = e.clientY;
  }
}

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    lastY = null;
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

updateDisplay();
