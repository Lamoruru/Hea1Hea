import { getCustomProperty, setCustomProperty, changeCustomProperty } from "../JavaScript/Utility.js";

const JUMP_EFFECT = new Audio('./Audios/jump.wav');
const LOSE_EFFECT = new Audio('./Audios/die.wav');
const DINO = document.getElementById('dino');
const FRAME_COUNT = 2; // Number of frames for running animation
const FRAME_TIME = 100; // Time per frame in milliseconds
const GRAVITY = 0.003; // Gravity effect
const JUMP_SPEED = 0.6; // Jump speed
const RESTART_BUTTON = document.getElementById('restartButton');
const SCORE_DISPLAY = document.getElementById('score'); // Display for current score
const HIGHSCORE_DISPLAY = document.getElementById('highest-score');

let isJumping;
let frame;
let currentFrameTime;
let velocity;
let score = 0; // Current score
let highestScore = 0; // Highest Score

// Set up the dinosaur's initial state
export function setUpDino() {
    isJumping = false;
    frame = 0;
    currentFrameTime = 0;
    velocity = 0;
    setCustomProperty(DINO, "--bottom", 0);
    document.addEventListener('keydown', handleJumpInput);
    document.addEventListener('click', handleJumpInput);
    updateScoreDisplay(); // Update score display on setup
}

// Update the dinosaur's state each frame
export function updateDino(delta, scale) {
    handleRun(delta, scale);
    handleJump(delta);
    updateDifficulty(); // Check for difficulty adjustments
}

// Get the bounding rectangle of the dinosaur for collision detection
export function getDinoRect() {
    return DINO.getBoundingClientRect();
}  

// Change the image when the dinosaur loses
export function loseDino() {
    DINO.src = "Images/dino-lose.png";
    RESTART_BUTTON.style.display = "block"; // Show the restart button
    LOSE_EFFECT.play(); // Play lose sound
    let thisScore = parseInt(SCORE_DISPLAY.textContent);
    if(thisScore >highestScore) {
        highestScore = thisScore;
    }
    HIGHSCORE_DISPLAY.textContent = `Highest Score: ${highestScore}`;
}

// Manage the running animation of the dinosaur
function handleRun(delta, scale) {
    if (isJumping) {
        DINO.src = "Images/dino.png"; // Set the jumping image
        return;
    }

    if (currentFrameTime >= FRAME_TIME) {
        frame = (frame + 1) % FRAME_COUNT; // Cycle through frames
        DINO.src = `Images/dino-${frame + 1}.png`; // Use dino-1.png and dino-2.png
        currentFrameTime -= FRAME_TIME;
    }
    currentFrameTime += delta * scale;

    // Increase score over time (or based on game events)
    score += delta * scale; // Change this logic as needed
    updateScoreDisplay(); // Update score display each frame
}

// Manage the jumping mechanics of the dinosaur
function handleJump(delta) {
    if (!isJumping) return;

    changeCustomProperty(DINO, '--bottom', velocity * delta);

    // Get the current position
    const dinoBottom = getCustomProperty(DINO, '--bottom');

    // Check if the dinosaur has landed
    if (dinoBottom <= 0) {
        setCustomProperty(DINO, '--bottom', 0);
        isJumping = false; // Reset jumping state
        velocity = 0; // Reset velocity when landing
    } else {
        // Apply gravity if still jumping
        velocity -= GRAVITY * delta; // Apply gravity
    }
}

// Handle jump input from keyboard or mouse
function handleJumpInput(e) {
    if (isJumping) return; // Prevents jumping if already in the air

    if (e.code === 'Space' || e.type === 'click') {
        velocity = JUMP_SPEED; // Set jump velocity
        isJumping = true; // Set jumping state
        JUMP_EFFECT.play(); // Play jump sound
    }
}

// Function to restart the game
function restartGame() {
    setUpDino(); // Reinitialize dino
    RESTART_BUTTON.style.display = "none"; // Hide the restart button
    score = 0; // Reset current score
    updateScoreDisplay(); // Reset score display
}

// Update score display
function updateScoreDisplay() {
    SCORE_DISPLAY.textContent = `${Math.floor(score)}`; // Update current score display
}

// Adjust game difficulty based on score
function updateDifficulty() {
    // Example: Increase game difficulty based on score
    if (score > 10) {
        // Increase speed or frequency of obstacles
        // This is a placeholder for actual difficulty adjustments
    }
}

// Event listener for the restart button
RESTART_BUTTON.addEventListener('click', restartGame);