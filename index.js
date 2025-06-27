const display = document.querySelector('.timer-display');
const button = document.getElementById('toggle-button');
const span = document.getElementById('toggle-text');


const popSound = new Audio('assets/pop.mp3');
const alarmSound = new Audio('assets/alarm.mp3');
alarmSound.loop = true;


let totalSeconds = 0;
let timerInterval = null;
let isRunning = false;
let startedFromZero = true;
let alarmActive = false;
let blinkInterval = null;

function updateDisplay() {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  display.textContent = `${minutes}:${seconds}`;
}

function startTimer() {

  if (totalSeconds == 0 || startedFromZero) {
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
        startedFromZero = true;
        alarm();
      }
    }, 1000);
  }
}

function alarm() {
  alarmActive = true;
  span.textContent = 'STOP';
  span.style.color = 'red';
  alarmSound.play();

  let red = true;
  blinkInterval = setInterval(() => {
    span.style.color = red ? 'black' : 'red'; // or replace 'black' with your default color
    red = !red;
  }, 500);
}

button.addEventListener('click', () => {

  if (alarmActive) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    clearInterval(blinkInterval);
    span.style.color = '';
    alarmActive = false;
    span.textContent = 'START';
    return;
  }

  popSound.play();

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

    if (minutes == 0 && totalSeconds == 0) {
      startedFromZero = true
    }
    startedFromZero = false

    totalSeconds = minutes * 60;
    updateDisplay();
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
