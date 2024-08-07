const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basket = {
    x: canvas.width - 150,
    y: canvas.height / 2 - 50,
    width: 100,
    height: 20
};

const ball = {
    x: 100,
    y: canvas.height / 2,
    radius: 15,
    dx: 0,
    dy: 0,
    mass: 10, 
    gravity: 0.5, 
    friction: 0.8, 
    dragging: false
};

let startX, startY, endX, endY;
let score = 0;
const maxDragDistance = 100; 

function drawBasket() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);
}

function updateBall() {
    if (!ball.dragging) {
        ball.dy += ball.gravity;
        ball.x += ball.dx;
        ball.y += ball.dy;

        
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.dy *= -ball.friction;
        }

        
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.dy *= -ball.friction;
        }

        
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.dx *= -ball.friction;
        }
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.dx *= -ball.friction;
        }
    }
}

function checkScore() {
    if (
        ball.x + ball.radius > basket.x &&
        ball.x - ball.radius < basket.x + basket.width &&
        ball.y - ball.radius < basket.y
    ) {
        score++;
        alert('Score!');
        resetBall();
    }

    if (
        ball.x + ball.radius > basket.x &&
        ball.x - ball.radius < basket.x + basket.width &&
        ball.y + ball.radius > basket.y &&
        ball.y - ball.radius < basket.y + basket.height &&
        ball.y - ball.radius < basket.y
    ) {
        score++;
        alert('Score!');
        resetBall();
    }
}

function resetBall() {
    ball.x = 100;
    ball.y = canvas.height / 2;
    ball.dx = 0;
    ball.dy = 0;
    ball.dragging = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawBall();
    drawScore();
    updateBall();
    checkScore();
    requestAnimationFrame(draw);
}

function startDrag(e) {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    if (Math.hypot(startX - ball.x, startY - ball.y) < ball.radius) {
        ball.dragging = true;
    }
}

function drag(e) {
    if (ball.dragging) {
        const rect = canvas.getBoundingClientRect();
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;

        
        const dragDistance = Math.hypot(endX - startX, endY - startY);

        
        if (dragDistance > maxDragDistance) {
            const ratio = maxDragDistance / dragDistance;
            endX = startX + (endX - startX) * ratio;
            endY = startY + (endY - startY) * ratio;
        }

        
        ball.x = endX;
        ball.y = endY;
    }
}

function endDrag(e) {
    if (ball.dragging) {
        const rect = canvas.getBoundingClientRect();
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;

        
        ball.dx = (startX - endX) * 0.2; 
        ball.dy = (startY - endY) * 0.2; 

        ball.dragging = false;
        updateBall();
    }
}

canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', endDrag);

draw();
