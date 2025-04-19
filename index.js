const cardContainer = document.getElementById("card-container");
const scoreDisplay = document.getElementById("score");
const flipsLeftDisplay = document.getElementById("flips-left");

let flippedCards = [];
let lockBoard = false;
let score = 0;
let matchedPairs = 0;
const emojis = ["🍎", "🍌", "🍒", "🍇", "🍉", "🥭"];

let flipsLeft = emojis.length * 3;

flipsLeftDisplay.textContent = flipsLeft;
scoreDisplay.textContent = score;

let cards = emojis.flatMap((emoji) => {
  const randomId = crypto.randomUUID();
  return [
    { emoji, id: randomId },
    { emoji, id: randomId },
  ];
});

cards = cards.sort(() => Math.random() - 0.5);
const cardMap = new Map();

cardContainer.innerHTML = cards
  .map(
    () => `
    <div class="card">
      <div class="inner-card">
        <div class="front-card"><h2>?</h2></div>
        <div class="back-card"><h2 class="hidden-content"></h2></div>
      </div>
    </div>
  `
  )
  .join("");

const cardElements = document.querySelectorAll(".card");
cardElements.forEach((cardElement, index) => {
  cardMap.set(cardElement, cards[index]);

  cardElement.addEventListener("click", () => {
    if (lockBoard || cardElement.classList.contains("flip")) return;
    if (flipsLeft <= 0) return;

    cardElement.classList.add("flip");
    cardElement.querySelector(".hidden-content").textContent =
      cardMap.get(cardElement).emoji;

    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {
      lockBoard = true;

      const [first, second] = flippedCards;
      const firstCardData = cardMap.get(first);
      const secondCardData = cardMap.get(second);
      const isMatch = firstCardData.id === secondCardData.id;

      if (isMatch) {
        score += 5;
        matchedPairs++;
        flippedCards = [];
        lockBoard = false;
      } else {
        setTimeout(() => {
          first.classList.remove("flip");
          second.classList.remove("flip");
          first.querySelector(".hidden-content").textContent = "";
          second.querySelector(".hidden-content").textContent = "";
          flippedCards = [];
          lockBoard = false;
        }, 1000);
        flipsLeft--;
        flipsLeftDisplay.textContent = flipsLeft;
      }
      scoreDisplay.textContent = score;
    }
    checkGameStatus();
  });
});

function checkGameStatus() {
  if (matchedPairs === emojis.length) {
    score += flipsLeft;
    scoreDisplay.textContent = score;
    setTimeout(() => {
      if (confirm("🎉 You Win! Would you like to play again?")) {
        window.location.reload();
      }
    }, 500);
  } else if (flipsLeft === 0) {
    setTimeout(() => {
      if (confirm("❌ You Lose! Try Again?")) {
        window.location.reload();
      }
    }, 500);
  }
}
