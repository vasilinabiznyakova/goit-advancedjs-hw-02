import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#ffffff',
        progressBarColor: '#b51b1b',
        close: true,
        icon: '',
        timeout: 3000,
        class: 'custom-toast',
      });

      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  clearInterval(timerId);

  startBtn.disabled = true;
  input.disabled = true;

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const currentTime = new Date();
  const deltaTime = userSelectedDate - currentTime;

  if (deltaTime <= 0) {
    clearInterval(timerId);
    updateTimerFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    input.disabled = false;
    startBtn.disabled = true;
    return;
  }

  const time = convertMs(deltaTime);
  updateTimerFace(time);
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
