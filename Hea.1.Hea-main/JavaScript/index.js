// Imports
import { setUpGround, updateGround } from "../JavaScript/ground.js";
import { loseDino, setUpDino, updateDino, getDinoRect } from "../JavaScript/dino.js";
import { setUpCactus, updatecactus, getCactusRects } from "./cactus.js";

// Variables and constants
const LOSE_EFFECT = new Audio('./Audios/die.wav');
const BACKGROUND_MUSIC = new Audio('./Audios/backgroundMusic.mp3'); // Add your background music
const START_SCREEN = document.getElementById('start-screen');
const SCORE = document.getElementById('score');
const SPEED_INCREASE = 0.00001;

let scale;
let score;
let lastTime;

// Game functions 
function startGame() {
    scale = 1;
    score = 0;
    lastTime = null;
    setUpGround();
    setUpDino();
    setUpCactus();
    START_SCREEN.classList.add('hide');
    document.getElementById('restartButton').style.display = 'none'; // Hide restart button
    
    // Start playing background music
    BACKGROUND_MUSIC.volume = 1.0; // Adjust volume as needed
    BACKGROUND_MUSIC.loop = true; // Loop the music
    BACKGROUND_MUSIC.play().catch((error) => {
        console.log('Error playing background music:', error);
    });

    window.requestAnimationFrame(GameLoop);
}

function handleLose() {
    loseDino();
    LOSE_EFFECT.play();
    BACKGROUND_MUSIC.pause(); // Stop background music when the game is lost
    document.getElementById('Restart').style.display = 'block'; // Show restart button
    window.addEventListener('keydown', startGame, { once: true });
}

function checkLose() {
    const dinoRect = getDinoRect();
    return getCactusRects().some(rect => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    );
}

function updateScore(delta) {
    score += delta * 0.01;
    SCORE.innerText = parseInt(score);
}

function updateScale(delta) {
    scale += delta * SPEED_INCREASE;
}

// GameLoop for constantly changing screen pixels
function GameLoop(time) {
    if (lastTime === null) {
        lastTime = time;
        window.requestAnimationFrame(GameLoop);
        return;
    }
    const delta = time - lastTime;
    lastTime = time;

    updateGround(delta, scale);
    updateDino(delta, scale);
    updateScore(delta);
    updateScale(delta);
    updatecactus(delta, scale);
    if (checkLose()) return handleLose();

    window.requestAnimationFrame(GameLoop);
}

// Get the restart button element
const restartButton = document.getElementById('restartButton');

// Add event listener to the restart button
restartButton.addEventListener('click', restartGame);

// Function to handle the restart button click
function restartGame() {
    // Reset game state
    scale = 1;
    score = 0;
    lastTime = null;

    // Set up game elements again
    setUpGround();
    setUpDino();
    setUpCactus();

    // Show the start screen
    START_SCREEN.classList.remove('hide');

    // Hide the restart button
    restartButton.style.display = 'none';

    // Restart background music
    BACKGROUND_MUSIC.currentTime = 0; // Reset music to start
    BACKGROUND_MUSIC.play().catch((error) => {
        console.log('Error playing background music:', error);
    });

    // Start a new game session
    window.requestAnimationFrame(GameLoop);
}

// Add a click event listener to the document to prevent restarting the game when clicking outside the button
document.addEventListener('click', (event) => {
    if (event.target !== restartButton) {
        // Prevent the game from restarting if the click is outside the restart button
        event.preventDefault();
    }
});

// Start the game on keydown or click
window.addEventListener('keydown', startGame, { once: true });