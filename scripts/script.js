// Set starting life totals
var playerLife = 5;
var hackerLife = 5;
var playerStartLife = playerLife;
var hackerStartLife = hackerLife;

var roundFinished = false;
var cardSelected = false;

var allCardElements;

var hackerWinnerMessage = "Game over: You got hacked!";
var playerWinnerMessage = "You defeated the hacker!";

// Called when "Start Game" button is clicked
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  allCardElements = document.querySelectorAll(".card");

  // Add click listeners to player cards
  allCardElements.forEach(card => {
    if (card.classList.contains("player-card")) {
      card.addEventListener("click", function () {
        cardClicked(this);
      });
    }
  });

  document.querySelector(".game-board").classList.remove("before-game");
  document.querySelector(".game-board").classList.add("during-game");

  updateScores();
  playTurn();
}

// Card click handler
function cardClicked(cardEl) {
  if (cardSelected) return;
  cardSelected = true;

  cardEl.classList.add("played-card");
  document.querySelector(".game-board").classList.add("card-selected");

  setTimeout(revealHackerPower, 500);
  setTimeout(revealPlayerPower, 800);
  setTimeout(compareCards, 1400);
}

function revealPlayerPower() {
  var playerCard = document.querySelector(".played-card");
  if (playerCard) playerCard.classList.add("reveal-power");
}

function revealHackerPower() {
  var hackerCard = document.querySelector(".hacker-card");
  hackerCard.classList.add("reveal-power");
}

function compareCards() {
  var playerCard = document.querySelector(".played-card");
  var playerPower = parseInt(playerCard.querySelector(".power").innerHTML);

  var hackerCard = document.querySelector(".hacker-card");
  var hackerPower = parseInt(hackerCard.querySelector(".power").innerHTML);

  var diff = playerPower - hackerPower;

  if (diff < 0) {
    playerLife += diff;
    hackerCard.classList.add("better-card");
    playerCard.classList.add("worse-card");
    document.querySelector(".player-stats .thumbnail").classList.add("ouch");
  } else if (diff > 0) {
    hackerLife -= diff;
    playerCard.classList.add("better-card");
    hackerCard.classList.add("worse-card");
    document.querySelector(".hacker-stats .thumbnail").classList.add("ouch");
  } else {
    playerCard.classList.add("tie-card");
    hackerCard.classList.add("tie-card");
  }

  updateScores();

  if (playerLife <= 0) {
    gameOver("Hacker");
  } else if (hackerLife <= 0) {
    gameOver("Player");
  }

  roundFinished = true;
  document.querySelector(".next-turn").removeAttribute("disabled");
}

function gameOver(winner) {
  document.querySelector(".game-board").classList.add("game-over");
  document.querySelector(".winner-section").style.display = "flex";

  const section = document.querySelector(".winner-section");
  section.classList.remove("player-color", "hacker-color");

  if (winner === "Hacker") {
    section.classList.add("hacker-color");
    document.querySelector(".winner-message").textContent = hackerWinnerMessage;
  } else {
    section.classList.add("player-color");
    document.querySelector(".winner-message").textContent = playerWinnerMessage;
  }
}

function updateScores() {
  document.querySelector(".player-stats .life-total").textContent = playerLife;
  document.querySelector(".hacker-stats .life-total").textContent = hackerLife;

  document.querySelector(".player-stats .life-left").style.height =
    Math.max((playerLife / playerStartLife) * 100, 0) + "%";

  document.querySelector(".hacker-stats .life-left").style.height =
    Math.max((hackerLife / hackerStartLife) * 100, 0) + "%";
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function playTurn() {
  roundFinished = true;
  cardSelected = false;

  document.querySelector(".game-board").classList.remove("card-selected");
  document.querySelector(".hacker-stats .thumbnail").classList.remove("ouch");
  document.querySelector(".player-stats .thumbnail").classList.remove("ouch");

  document.querySelector(".next-turn").setAttribute("disabled", "true");

  allCardElements.forEach(card => card.classList.remove("showCard"));

  setTimeout(revealCards, 500);
}

function revealCards() {
  let j = 0;
  const cardIndexes = shuffleArray([0, 1, 2]);

  const randomScenarioIndex = Math.floor(Math.random() * scenarios.length);
  const scenario = scenarios[randomScenarioIndex];
  scenarios.splice(randomScenarioIndex, 1); // Remove used scenario

  const hackerCard = scenario.hackerCard;
  const hackerCardEl = document.querySelector(".hacker-area .card");
  const playerCards = scenario.playerCards;

  allCardElements.forEach((card, i) => {
    card.classList.remove("worse-card", "better-card", "played-card", "tie-card", "prepared", "reveal-power");

    if (card.classList.contains("player-card")) {
      const idx = cardIndexes[j++];
      card.querySelector(".text").textContent = playerCards[idx].description;
      card.querySelector(".power").textContent = playerCards[idx].power;
    }

    setTimeout(() => {
      card.style.display = "block";
      card.classList.add("showCard");
    }, (i + 1) * 200);
  });

  hackerCardEl.querySelector(".text").textContent = hackerCard.description;
  hackerCardEl.querySelector(".power").textContent = hackerCard.power;
}
