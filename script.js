// Wait for the HTML elements to finish loading before running script
document.addEventListener("DOMContentLoaded", () => {
  
  // --- EXISTING FEATURES: Dark Mode & Magic Button ---
  const magicBtn = document.getElementById("magicBtn");
  const message = document.getElementById("message");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  magicBtn.addEventListener("click", () => {
    message.textContent = "🎉 You clicked the button! Your JavaScript is working!";
  });

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeToggleBtn.textContent = "☀️ Switch to Light Mode";
    } else {
      themeToggleBtn.textContent = "🌙 Switch to Dark Mode";
    }
  });

  // --- NEW FEATURE: Mini-Golf Game Logic ---
  const canvas = document.getElementById("golfCanvas");
  const ctx = canvas.getContext("2d");
  const strokeCounter = document.getElementById("strokeCounter");
  const gameStatusMessage = document.getElementById("gameStatusMessage");
  const resetGameBtn = document.getElementById("resetGameBtn");

  // Golf ball position and velocity variables
  let ball = { x: 80, y: 150, radius: 8, vx: 0, vy: 0 };
  // Hole position and radius
  const hole = { x: 320, y: 150, radius: 12 };
  
  let strokes = 0;
  let isMoving = false;
  let inHole = false;

  // Function to draw the golf field, ball, and hole on canvas
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the Hole (black circle)
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#111111";
    ctx.fill();
    ctx.closePath();

    // Draw Flagpole
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y);
    ctx.lineTo(hole.x, hole.y - 30);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Flag
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - 30);
    ctx.lineTo(hole.x - 15, hole.y - 22);
    ctx.lineTo(hole.x, hole.y - 15);
    ctx.fillStyle = "red";
    ctx.fill();

    // Draw Golf Ball (white circle)
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.closePath();
  }

  // Game update loop for ball physics
  function update() {
    if (isMoving) {
      // Move ball based on current velocity
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Apply friction to slow ball down gradually
      ball.vx *= 0.98;
      ball.vy *= 0.98;

      // Bounce off canvas walls
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.vx *= -1;
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.vy *= -1;

      // Stop ball when moving very slowly
      if (Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1) {
        ball.vx = 0;
        ball.vy = 0;
        isMoving = false;
      }

      // Check if ball went inside the hole
      const distToHole = Math.hypot(ball.x - hole.x, ball.y - hole.y);
      if (distToHole < hole.radius - 2) {
        inHole = true;
        isMoving = false;
        ball.vx = 0;
        ball.vy = 0;
        ball.x = hole.x;
        ball.y = hole.y;
        gameStatusMessage.textContent = `🎉 Hole-in-one! You finished in ${strokes} stroke(s)!`;
      }
    }

    draw();
    requestAnimationFrame(update);
  }

  // Handle player clicking canvas to stroke the ball
  canvas.addEventListener("click", (e) => {
    if (isMoving || inHole) return; // Can't hit while ball is rolling or already in hole

    // Get click position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate aim direction vector from ball to click
    const dx = clickX - ball.x;
    const dy = clickY - ball.y;

    // Hit ball in direction of click (scaled power)
    ball.vx = dx * 0.08;
    ball.vy = dy * 0.08;

    isMoving = true;
    strokes++;
    strokeCounter.textContent = strokes;
    gameStatusMessage.textContent = "Rolling...";
  });

  // Reset ball to starting position
  function resetGame() {
    ball.x = 80;
    ball.y = 150;
    ball.vx = 0;
    ball.vy = 0;
    strokes = 0;
    isMoving = false;
    inHole = false;
    strokeCounter.textContent = strokes;
    gameStatusMessage.textContent = "";
  }

  resetGameBtn.addEventListener("click", resetGame);

  // Start initial render loop
  update();
});
