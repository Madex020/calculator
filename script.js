const board = document.getElementById("board");
const movesElement = document.getElementById("moves");
const pairsElement = document.getElementById("pairs");
const timeElement = document.getElementById("time");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

const pictures = ["🐱", "🐶", "🐼", "🦊", "🐸", "🦁", "🐵", "🐰"];

let firstCard = null;
let secondCard = null;
let locked = false;
let moves = 0;
let pairs = 0;
let seconds = 0;
let timer = null;
let started = false;
let gameId = 0;

function startGame() {
    gameId++;

    clearInterval(timer);

    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    pairs = 0;
    seconds = 0;
    started = false;

    movesElement.textContent = "0";
    pairsElement.textContent = "0";
    timeElement.textContent = "00:00";
    message.textContent = "Найди две одинаковые карточки!";

    board.innerHTML = "";

    const cards = [...pictures, ...pictures]
        .sort(() => Math.random() - 0.5);

    cards.forEach((picture) => {
        const card = document.createElement("button");

        card.className = "card";
        card.textContent = "?";
        card.dataset.picture = picture;
        card.setAttribute("aria-label", "Закрытая карточка");

        card.addEventListener("click", () => flipCard(card));

        board.appendChild(card);
    });
}

function startTimer() {
    if (started) return;

    started = true;

    const currentGame = gameId;

    timer = setInterval(() => {
        if (currentGame !== gameId) return;

        seconds++;

        const minutes = String(
            Math.floor(seconds / 60)
        ).padStart(2, "0");

        const secs = String(seconds % 60).padStart(2, "0");

        timeElement.textContent = `${minutes}:${secs}`;
    }, 1000);
}

function flipCard(card) {
    if (
        locked ||
        card.classList.contains("open") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    startTimer();

    card.classList.add("open");
    card.textContent = card.dataset.picture;
    card.setAttribute("aria-label", card.dataset.picture);

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;

    movesElement.textContent = moves;

    if (firstCard.dataset.picture === secondCard.dataset.picture) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        pairs++;
        pairsElement.textContent = pairs;

        firstCard = null;
        secondCard = null;

        if (pairs === pictures.length) {
            clearInterval(timer);
            message.textContent =
                `🏆 Победа! Ты нашёл все пары за ${moves} ходов!`;
        } else {
            message.textContent = "Отлично! Пара найдена 🎉";
        }
    } else {
        locked = true;
        message.textContent = "Не совпали! Попробуй ещё раз.";

        const currentGame = gameId;

        setTimeout(() => {
            if (currentGame !== gameId) return;

            firstCard.classList.remove("open");
            secondCard.classList.remove("open");

            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard.setAttribute("aria-label", "Закрытая карточка");
            secondCard.setAttribute("aria-label", "Закрытая карточка");

            firstCard = null;
            secondCard = null;
            locked = false;

            message.textContent = "Найди две одинаковые карточки!";
        }, 900);
    }
}

restartButton.addEventListener("click", startGame);

startGame();