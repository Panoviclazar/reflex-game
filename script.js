const btnStartApp = document.querySelector(".start-app");
const btnStartStopwatch = document.querySelector(".start-stopwatch");
const messageCont = document.querySelector(".message");
const playCont = document.querySelector(".playing-cont");
const currentScore = document.querySelector(".current-score");
const body = document.getElementsByTagName("BODY")[0];
const inputValue = document.querySelector(".input-value");
const reset = document.querySelector(".reset");
const nameLabel = document.querySelector(".name-label");
const currentTime = document.querySelector(".current-time");
const reflexTimeLabel = document.querySelector(".reflex-time-label");
const congrats = document.querySelector(".congrats");
const crownEoji = document.querySelector(".fa-crown2");
const sadEmoji = document.querySelector(".fa-face-frown");
const Erorrs = document.querySelector(".errors");
const highscores = document.querySelector(".highscores");
const playerName = document.querySelector(".player-name");
const userMessage = document.querySelector(".message-for-user");
const playerScore = document.querySelector(".player-score");
let currentUser;
let enable = true;

btnStartApp.addEventListener("click", (e) => {
  if (inputValue.value) {
    currentUser = inputValue.value;
    playerName.value = currentUser;
    messageCont.style.display = "none";
    setTimeout(function () {
      playCont.style.display = "flex";
    }, 300);
  } else {
    inputValue.style.borderBottom = "2px solid #f94144";
    inputValue.style.transform = "translateY(-3px)";
    setTimeout(function () {
      inputValue.style.transform = "translateY(0px)";
    }, 50);
  }
  inputValue.value = "";
});

btnStartStopwatch.addEventListener("click", () => {
  if (enable) {
    enable = false;
    body.style.background = "#80ed99";
    setTimeout(function () {
      body.style.background = "#f94144";
      clearInterval(interval);
      interval = setInterval(startStopwatch, 10);
    }, 5000);
  }
});

// Stopwatch

const secondsLabel = document.querySelector(".seconds-label");
const milisecondsLabel = document.querySelector(".miliseconds-label");
const stopwatch = document.querySelector(".stopwatch");
let seconds = 00;
let miliseconds = 00;
let interval;

function startStopwatch() {
  miliseconds++;
  if (miliseconds <= 9) {
    milisecondsLabel.innerHTML = `0${miliseconds}`;
  }
  if (miliseconds > 9) {
    milisecondsLabel.innerHTML = miliseconds;
  }
  if (miliseconds > 99) {
    seconds++;
    miliseconds = 00;
    secondsLabel.innerHTML = `0${seconds}`;
    milisecondsLabel.innerHTML = `0${miliseconds}`;
    if (seconds > 9) {
      secondsLabel.innerHTML = seconds;
    }
  }
}

stopwatch.addEventListener("click", () => {
  if (Number(milisecondsLabel.textContent) > 0) {
    clearInterval(interval);
    body.style.background = "#80ed99";
    playerScore.value = miliseconds;
    currentTime.value = `${secondsLabel.textContent}:${milisecondsLabel.textContent}`;
    playerName.value = currentUser;
    console.log(playerScore.value, playerName.value);
    setTimeout(function () {
      if (
        Number(milisecondsLabel.textContent) < 25 &&
        Number(secondsLabel.textContent) == 0
      ) {
        congrats.textContent = `Congratulations ${currentUser},`;
        userMessage.textContent =
          "your visual reflex time is better than average (0.25s)";
        crownEoji.style.display = "block";
      } else if (
        Number(milisecondsLabel.textContent) >= 25
      ) {
        sadEmoji.style.display = "block";
        reflexTimeLabel.style.color = "#f94144";
        currentTime.style.color = "#f94144";
        reset.style.color = "#f94144";
        reset.style.boxShadow = "1px 1px 5px #f94144";
        congrats.textContent = `Good try ${currentUser},`;
        userMessage.textContent =
          "but your visual reflex time is worse than average (0.25s)";
      }
      seconds = 0;
      miliseconds = 0;
      secondsLabel.innerHTML = `0${seconds}`;
      milisecondsLabel.innerHTML = `0${miliseconds}`;
      playCont.style.display = "none";
      body.style.background =
        "linear-gradient(151deg, rgba(202,240,248,1) 0%, rgba(234,240,248,1) 35%, rgba(255,255,255,1) 100%)";
      setTimeout(function () {
        currentScore.style.display = "flex";
      }, 300);
    }, 3000);
  }
});

// highscores fetch

function get_scores(callback) {
  // highscore data

  let file = "scores.json";
  fetch(file, { cache: "no-cache" })
    .then(function (response) {
      if (response.status !== 200) {
        Erorrs.innerHTML = response.status;
      }
      response.json().then(function (data) {
        let allscoress = JSON.stringify(data);
        callback(allscoress);
      });
    })

    .catch(function (err) {
      Erorrs.innerHTML = err;
    });
}

// display highscore list

var listScores = function (scores) {
  let object = JSON.parse(scores);
  // lowest scores
  let lowestScore = object[2].score;
  document.getElementById("lowscore").value = lowestScore;

  for (let i = 0; i < object.length; i++) {
    let li = document.createElement("li");
    let text = document.createTextNode(
      `${object[i].name} (${object[i].score}s)`
    );
    li.appendChild(text);
    highscores.appendChild(li);

    if (i === 0) {
      li.setAttribute("class", "top1");
    }
    if (i === 1) {
      li.setAttribute("class", "top2");
    }
    if (i === 2) {
      li.setAttribute("class", "top3");
    }
  }
};

function resetForm() {
  while (highscores.hasChildNodes()) {
    highscores.removeChild(highscores.firstChild);
  }

  get_scores(listScores);

  document.getElementById("score").value = 0;

}

reset.addEventListener("submit", function (e) {
  e.preventDefault();

  var formData = new FormData(this);

  // POST fetch req

  fetch("highscores.php", {
    method: "post",
    body: formData,
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      resetForm();
      console.log(text);
    });
});