let time = 4;
let interval = null;
let score = 0;
let running = false;
let lost = false;

const rabbits = {
  4: "https://i.ibb.co/JR4JpZVV/048-A64-F8-624-A-41-D8-ADAE-57-B50-A1-C1345.png",
  3: "https://i.ibb.co/LX6w4H9S/F022741-F-BCC9-45-D2-98-A8-90-B7465-DA8-DE.png",
  2: "https://i.ibb.co/HLhfhsGj/EAE26-D85-846-D-4-E30-839-E-5-ADC01-CB52-CA.png",
  1: "https://i.ibb.co/MyzkxVv8/9756-C2-F9-453-F-48-AD-BD27-7700-D2-EF3-DD3.png",
  0: "https://i.ibb.co/FkGMGyK8/BDF215-DB-1-D8-E-40-AA-9-B94-36451179-B92-D.png"
};

const timer = document.getElementById("timer");
const buzzer = document.getElementById("buzzer");
const message = document.getElementById("message");
const app = document.getElementById("app");
const rabbit = document.getElementById("rabbit");
const rabbitState = document.getElementById("rabbitState");

function beep(frequency = 700, duration = 100) {
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    gain.gain.value = 0.12;

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + duration / 1000
    );
  } catch (e) {}
}

function updateRabbit() {

  rabbit.src = rabbits[time];

  if (time === 4) {
    timer.style.color = "#00ff66";
    rabbitState.textContent = "TRANQUILLE";
    rabbitState.style.color = "#00ff66";
  }

  if (time === 3) {
    timer.style.color = "#dfff00";
    rabbitState.textContent = "RÉFLÉCHIS !";
    rabbitState.style.color = "#dfff00";
  }

  if (time === 2) {
    timer.style.color = "#ff9900";
    rabbitState.textContent = "ÇA STRESSE !";
    rabbitState.style.color = "#ff9900";
  }

  if (time === 1) {
    timer.style.color = "#ff3030";
    rabbitState.textContent = "PANIQUE !";
    rabbitState.style.color = "#ff3030";
  }

  if (time === 0) {
    timer.style.color = "#ff3030";
    rabbitState.textContent = "PERDU !";
    rabbitState.style.color = "#ff3030";
  }
}

function startRound() {

  clearInterval(interval);

  running = true;
  lost = false;
  time = 4;

  app.classList.remove("lost");

  timer.textContent = time;

  if (score === 0) {
    message.textContent = "C'EST PARTI !";
  } else {
    message.textContent =
      "RÉPONSE " + score + " ✓";
  }

  updateRabbit();
  beep(850, 80);

  interval = setInterval(() => {

    time--;

    timer.textContent = time;
    updateRabbit();

    if (time === 3) beep(650, 80);
    if (time === 2) beep(750, 90);
    if (time === 1) beep(900, 120);

    if (time <= 0) {

      clearInterval(interval);

      running = false;
      lost = true;

      message.textContent =
  score + (score === 1 ? " RÉPONSE" : " RÉPONSES");
  

      app.classList.add("lost");

      beep(160, 700);

      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]);
      }
    }

  }, 1000);
}

buzzer.addEventListener("click", () => {

  /*
    PREMIER BUZZ :
    démarre la partie
  */

  if (!running && !lost && score === 0) {
    startRound();
    return;
  }

  /*
    BUZZ pendant le décompte :
    réponse validée
  */

  if (running) {

    clearInterval(interval);

    score++;

    beep(1100, 100);

    startRound();
    return;
  }

  /*
    BUZZ après PERDU :
    nouvelle partie
  */

  if (lost) {

    score = 0;
    lost = false;

    startRound();
  }
});
