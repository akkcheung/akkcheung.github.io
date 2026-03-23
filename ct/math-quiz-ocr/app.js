const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const questionDisplay = document.getElementById('question-display');
const statusMsg = document.getElementById('status-message');
const scoreEl = document.getElementById('score');

// Game State
let num1, num2, correctAnswer;
let score = 0;
let isDrawing = false;

// Drawing Settings
ctx.lineWidth = 14;
ctx.lineCap = 'round';
ctx.strokeStyle = '#000000';

// --- Event Listeners for Drawing ---
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e.touches[0]); });
canvas.addEventListener('touchend', finishedPosition);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });

function startPosition(e) {
    isDrawing = true;
    draw(e);
}

function finishedPosition() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// --- Game Logic ---

function generateProblem() {
    num1 = Math.floor(Math.random() * 5); // Kept small for single-digit results
    num2 = Math.floor(Math.random() * 5);
    correctAnswer = num1 + num2;
    
    questionDisplay.innerText = `${num1} + ${num2} = ?`;
    statusMsg.innerText = "Draw the answer clearly!";
    statusMsg.style.color = "#7f8c8d";
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('check-btn').style.display = 'inline-block';
}

async function checkAnswer() {
    statusMsg.innerText = "Analyzing your masterpiece...";
    
    try {
        // Tesseract scans the canvas
        const result = await Tesseract.recognize(canvas, 'eng', {
            tessedit_char_whitelist: '0123456789'
        });
        
        const recognizedText = result.data.text.trim();
        const recognizedNum = parseInt(recognizedText);

        if (recognizedNum === correctAnswer) {
            score++;
            scoreEl.innerText = score;
            statusMsg.innerText = `Correct! I saw ${recognizedNum}.`;
            statusMsg.style.color = "#2ecc71";
            
            document.getElementById('check-btn').style.display = 'none';
            document.getElementById('next-btn').style.display = 'inline-block';
        } else {
            statusMsg.innerText = `Oops! I saw "${recognizedText || 'nothing'}". Try again!`;
            statusMsg.style.color = "#e74c3c";
        }
    } catch (err) {
        statusMsg.innerText = "Recognition error. Try clearing and redrawing.";
    }
}

// --- Buttons ---
document.getElementById('clear-btn').onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    statusMsg.innerText = "Canvas cleared!";
};

document.getElementById('check-btn').onclick = checkAnswer;
document.getElementById('next-btn').onclick = generateProblem;

// Start Game
generateProblem();
