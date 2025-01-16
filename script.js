const startButton = document.getElementById("start-button");
const exitButton = document.getElementById("exit-button");
const resetButton = document.getElementById("reset-button");
const pauseButton = document.getElementById("pause-button");
const menuButton = document.getElementById("menu-button");
const gameContainer = document.getElementById("game-container");
const timerDisplay = document.getElementById("timer");
const gameTitle = document.getElementById("game-title");
const levelButton = document.getElementById("level-button");
const buttonContainer = document.getElementById("button-container");

const cardImages = [
    'https://picsum.photos/100/100?random=1',
    'https://picsum.photos/100/100?random=2',
    'https://picsum.photos/100/100?random=3',
    'https://picsum.photos/100/100?random=4',
    'https://picsum.photos/100/100?random=5',
    'https://picsum.photos/100/100?random=6',
    'https://picsum.photos/100/100?random=7',
    'https://picsum.photos/100/100?random=8',
];

let cards = [];
let flippedCards = [];
let matchedCards = [];
let timer = 60;
let timerInterval;
let gamePaused = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateCards() {
    let shuffledImages = [...cardImages, ...cardImages];
    shuffledImages = shuffleArray(shuffledImages);
    gameContainer.innerHTML = '';

    shuffledImages.forEach((image, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;

        const img = document.createElement("img");
        img.src = image;

        card.appendChild(img);
        card.addEventListener("click", flipCard);

        gameContainer.appendChild(card);
        cards.push(card);
    });
}

function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains("flipped") || this.classList.contains("matched") || timer === 0 || gamePaused) return;

    this.classList.add("flipped");
    this.querySelector("img").style.display = "block";
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 600);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const img1 = card1.querySelector("img").src;
    const img2 = card2.querySelector("img").src;

    if (img1 === img2) {
        card1.classList.add("matched");
        card2.classList.add("matched");

        setTimeout(() => {
            card1.style.visibility = "hidden";
            card2.style.visibility = "hidden";
        }, 500);

        matchedCards.push(card1, card2);
        flippedCards = [];

        if (matchedCards.length === cards.length) {
            clearInterval(timerInterval);
            showCongratulationsPage();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.querySelector("img").style.display = "none";
            card2.querySelector("img").style.display = "none";
            flippedCards = [];
        }, 1000);
    }
}


function showCongratulationsPage() {
    gameContainer.style.display = "none";
    timerDisplay.style.display = "none";
    levelButton.style.display = "none";
    resetButton.style.display = "none";
    pauseButton.style.display = "none";
    menuButton.style.display = "none";

    const congratulationsPage = document.getElementById("congratulations-page");
    congratulationsPage.style.display = "block";
}

function startGame() {
    generateCards();
    timerDisplay.style.display = "block";
    resetButton.style.display = "inline-block";
    pauseButton.style.display = "inline-block";
    menuButton.style.display = "inline-block";
    startButton.style.display = "none";
    exitButton.style.display = "none";
    levelButton.style.display="block";
    gameTitle.style.display = "none";
    buttonContainer.classList.add("active");
    timer = 60;
    timerDisplay.textContent = `Time: ${timer}s`;
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timer > 0 && !gamePaused) {
            timer--;
            timerDisplay.textContent = `Time: ${timer}s`;
        } else if (timer === 0) {
            clearInterval(timerInterval);
            alert("Time's Up!");
            disableAllCards();
        }
    }, 1000);
}

function disableAllCards() {
    cards.forEach(card => {
        card.removeEventListener("click", flipCard);
    });
}

function resetGame() {
    matchedCards = [];
    flippedCards = [];
    gamePaused = false;
    cards.forEach(card => {
        card.classList.remove("flipped", "matched");
        card.querySelector("img").style.display = "none";
        card.style.visibility = "visible";
    });
    generateCards();
    timer = 60;
    timerDisplay.textContent = `Time: ${timer}s`;
    startTimer();
    pauseButton.textContent = "Pause Game";  
}

function backToMenu() {
    resetButton.style.display = "none";
    pauseButton.style.display = "none";
    menuButton.style.display = "none";
    levelButton.style.display = "none";
    startButton.style.display = "inline-block";
    exitButton.style.display = "inline-block"; 
    gameTitle.style.display = "block";
    buttonContainer.classList.remove("active");
    gameContainer.innerHTML = '';
    timerDisplay.style.display = "none";
    clearInterval(timerInterval);
    timer = 60;
    timerDisplay.textContent = `Time: ${timer}s`;

    pauseButton.textContent = "Pause Game";   
    gamePaused = false;
}

function pauseGame() {
    clearInterval(timerInterval);
    gamePaused = true;
    pauseButton.textContent = "Resume Game";
    pauseButton.removeEventListener("click", pauseGame);
    pauseButton.addEventListener("click", resumeGame);
}

function resumeGame() {
    startTimer();
    gamePaused = false;
    pauseButton.textContent = "Pause Game";
    pauseButton.removeEventListener("click", resumeGame);
    pauseButton.addEventListener("click", pauseGame);
}

function exitGame() {
    const exitPage = `
        <div id="exit-page">
            <h1>See you later! 👋</h1>
            <p>Thanks for playing the Memory Game! Bye!</p>
        </div>
    `;
    document.body.innerHTML = exitPage;
}

startButton.addEventListener("click", startGame);
exitButton.addEventListener("click", exitGame);
resetButton.addEventListener("click", resetGame);
menuButton.addEventListener("click", backToMenu);
pauseButton.addEventListener("click", pauseGame);
