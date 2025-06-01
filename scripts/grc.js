// Starting metrics for player
var compliance = 100;
var trust = 100;
var maxCompliance = 100;
var maxTrust = 100;

var roundFinished = false;
var cardSelected = false;

var allCardElements;

var complianceFailMessage = "Game over: Compliance breached!";
var trustFailMessage = "Game over: Trust lost!";

// Example scenarios array with hacker and player cards
var scenarios = [
  {
    hackerCard: {
      description: "Phishing Attack",
      power: 30,
      complianceImpact: 25,
      trustImpact: 30
    },
    playerCards: [
      { description: "Employee Training", power: 20, complianceImpact: 10, trustImpact: 15 },
      { description: "Email Filtering", power: 25, complianceImpact: 20, trustImpact: 10 },
      { description: "Password Policy", power: 15, complianceImpact: 5, trustImpact: 5 }
    ]
  },
  {
    hackerCard: {
      description: "Malware Injection",
      power: 40,
      complianceImpact: 30,
      trustImpact: 35
    },
    playerCards: [
      { description: "Antivirus Update", power: 35, complianceImpact: 25, trustImpact: 20 },
      { description: "System Backup", power: 25, complianceImpact: 10, trustImpact: 25 },
      { description: "Network Monitoring", power: 20, complianceImpact: 15, trustImpact: 10 }
    ]
  },
  {
    hackerCard: {
      description: "DDoS Attack",
      power: 35,
      complianceImpact: 20,
      trustImpact: 30
    },
    playerCards: [
      { description: "Firewall Rules", power: 30, complianceImpact: 15, trustImpact: 20 },
      { description: "Load Balancer", power: 25, complianceImpact: 10, trustImpact: 15 },
      { description: "Traffic Filtering", power: 20, complianceImpact: 10, trustImpact: 10 }
    ]
  }
];

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
  var hackerCard = document.querySelector(".hacker-card");

  // Get compliance and trust impacts from data attributes
  var playerComplianceImpact = parseInt(playerCard.getAttribute("data-compliance")) || 0;
  var playerTrustImpact = parseInt(playerCard.getAttribute("data-trust")) || 0;

  var hackerComplianceImpact = parseInt(hackerCard.getAttribute("data-compliance")) || 0;
  var hackerTrustImpact = parseInt(hackerCard.getAttribute("data-trust")) || 0;

  // Net impact calculation: hacker impact minus player impact
  var netComplianceImpact = hackerComplianceImpact - playerComplianceImpact;
  var netTrustImpact = hackerTrustImpact - playerTrustImpact;

  // Apply impacts only if positive (player loses compliance/trust)
  if (netComplianceImpact > 0) {
    compliance = Math.max(compliance - netComplianceImpact, 0);
  }
  if (netTrustImpact > 0) {
    trust = Math.max(trust - netTrustImpact, 0);
  }

  // Visual card comparison
  if (netComplianceImpact > 0 || netTrustImpact > 0) {
    hackerCard.classList.add("better-card");
    playerCard.classList.add("worse-card");
  } else if (netComplianceImpact < 0 || netTrustImpact < 0) {
    playerCard.classList.add("better-card");
    hackerCard.classList.add("worse-card");
  } else {
    playerCard.classList.add("tie-card");
    hackerCard.classList.add("tie-card");
  }

  updateScores();

  // Check game over conditions
  if (compliance <= 0) {
    gameOver("Compliance");
  } else if (trust <= 0) {
    gameOver("Trust");
  }

  roundFinished = true;
  document.querySelector(".next-turn").removeAttribute("disabled");
}

function gameOver(reason) {
  document.querySelector(".game-board").classList.add("game-over");
  const section = document.querySelector(".winner-section");
  section.style.display = "flex";

  section.classList.remove("player-color", "hacker-color");

  if (reason === "Compliance") {
    section.classList.add("hacker-color");
    document.querySelector(".winner-message").textContent = complianceFailMessage;
  } else if (reason === "Trust") {
    section.classList.add("hacker-color");
    document.querySelector(".winner-message").textContent = trustFailMessage;
  } else {
    section.classList.add("player-color");
    document.querySelector(".winner-message").textContent = "You defeated the hacker!";
  }
}

function updateScores() {
  // Update compliance and trust bars and numbers
  const complianceBar = document.querySelector(".compliance .life-left");
  const trustBar = document.querySelector(".trust .life-left");
  const complianceTotal = document.querySelector(".compliance .life-total");
  const trustTotal = document.querySelector(".trust .life-total");

  if (complianceBar && trustBar && complianceTotal && trustTotal) {
    complianceTotal.textContent = compliance;
    trustTotal.textContent = trust;

    complianceBar.style.height = (compliance / maxCompliance) * 100 + "%";
    trustBar.style.height = (trust / maxTrust) * 100 + "%";
  }
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

  allCardElements.forEach(card => card.classList.remove("showCard", "worse-card", "better-card", "played-card", "tie-card", "prepared", "reveal-power"));

  setTimeout(revealCards, 500);
}

function revealCards() {
  if (scenarios.length === 0) {
    // No more scenarios, player wins
    gameOver("Win");
    return;
  }

  let j = 0;
  const cardIndexes = shuffleArray([0, 1, 2]);

  const randomScenarioIndex = Math.floor(Math.random() * scenarios.length);
  const scenario = scenarios[randomScenarioIndex];
  scenarios.splice(randomScenarioIndex, 1); // Remove used scenario

  const hackerCard = scenario.hackerCard;
  const hackerCardEl = document.querySelector(".hacker-area .card");
  const playerCards = scenario.playerCards;

  allCardElements.forEach((card, i) => {
    if (card.classList.contains("player-card")) {
      const idx = cardIndexes[j++];
      card.querySelector(".text").textContent = playerCards[idx].description;
      card.querySelector(".power").textContent = playerCards[idx].power;

      // Set impacts on data attributes for later use
      card.setAttribute("data-compliance", playerCards[idx].complianceImpact);
      card.setAttribute("data-trust", playerCards[idx].trustImpact);
    }
  });

  hackerCardEl.querySelector(".text").textContent = hackerCard.description;
  hackerCardEl.querySelector(".power").textContent = hackerCard.power;

  // Set hacker impacts
  hackerCardEl.setAttribute("data-compliance", hackerCard.complianceImpact);
  hackerCardEl.setAttribute("data-trust", hackerCard.trustImpact);

  setTimeout(() => {
    allCardElements.forEach(card => {
      card.style.display = "block";
      card.classList.add("showCard");
    });
  }, 300);
}
