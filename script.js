// Wait for all HTML elements to load before executing JavaScript
document.addEventListener("DOMContentLoaded", () => {
  
  // --- CORE FEATURES: Dark Mode & Magic Button ---
  const magicBtn = document.getElementById("magicBtn");
  const message = document.getElementById("message");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  if (magicBtn) {
    magicBtn.addEventListener("click", () => {
      message.textContent = "🎉 You clicked the button! Your JavaScript is working!";
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "☀️ Switch to Light Mode";
      } else {
        themeToggleBtn.textContent = "🌙 Switch to Dark Mode";
      }
    });
  }

  // --- FLAPPY BIRD GAME ENGINE ---
  const canvas = document.getElementById("flappyCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const highScoreDisplay = document.getElementById("highScoreDisplay");
  const gameStatusMessage = document.getElementById("gameStatusMessage");
  const restartBtn = document.getElementById("restartGameBtn");

  // Game Variables
  let bird = { x: 50, y: 150, width: 24, height: 24, gravity: 0.25, lift: -5.5, velocity: 0 };
  let pipes = [];
  let frameCount = 0;
  let score = 0;
  let highScore = 0;
  let isPlaying = false;
  let isGameOver = false;
  let animationId = null;

  // Pipe Settings
  const pipeWidth = 52;
  const pipeGap = 110;
  const pipeSpeed = 2;

  function flap() {
    if (isGameOver) {
      startGame();
      return;
    }
    if (!isPlaying) {
      isPlaying = true;
    }
    bird.velocity = bird.lift;
  }

  function startGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    isPlaying = false;
    isGameOver = false;

    if (scoreDisplay) scoreDisplay.textContent = score;
    if (gameStatusMessage) gameStatusMessage.textContent = "Click or Press Space to Flap!";

    if (animationId) cancelAnimationFrame(animationId);
    gameLoop();
  }

  function update() {
    if (!isPlaying || isGameOver) return;

    // Apply gravity to bird velocity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Ground and Ceiling Collisions
    if (bird.y + bird.height >= canvas.height - 20) {
      bird.y = canvas.height - 20 - bird.height;
      triggerGameOver();
    }
    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    // Spawn pipes every 100 frames
    frameCount++;
    if (frameCount % 100 === 0) {
      const minHeight = 40;
      const maxHeight = canvas.height - pipeGap - 60;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

      pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        passed: false
      });
    }

    // Move pipes and check collisions
    pipes.forEach((pipe) => {
      pipe.x -= pipeSpeed;

      // Check collision with Top Pipe
      if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        bird.y < pipe.top
      ) {
        triggerGameOver();
      }

      // Check collision with Bottom Pipe
      if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        bird.y + bird.height > canvas.height - pipe.bottom
      ) {
        triggerGameOver();
      }

      // Check if bird passed the pipe successfully
      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        pipe.passed = true;
        score++;
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (score > highScore) {
          highScore = score;
          if (highScoreDisplay) highScoreDisplay.textContent = highScore;
        }
      }
    });

    // Remove off-screen pipes
    pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);
  }

  function draw() {
    // 1. Draw Sky Background
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Pipes
    pipes.forEach((pipe) => {
      ctx.fillStyle = "#73bf2e";
      ctx.strokeStyle = "#53801b";
      ctx.lineWidth = 3;

      // Top Pipe
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
      ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);

      // Bottom Pipe
      ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
      ctx.strokeRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });

    // 3. Draw Ground
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.fillStyle = "#73bf2e";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 4);

    // 4. Draw Bird (Yellow circle with wing and eye detail)
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d68910";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 + 5, bird.y + bird.height / 2 - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 + 6, bird.y + bird.height / 2 - 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(bird.x + bird.width - 2, bird.y + bird.height / 2, 8, 5);
  }

  function triggerGameOver() {
    isGameOver = true;
    isPlaying = false;
    if (gameStatusMessage) {
      gameStatusMessage.textContent = "💥 Game Over! Press Space or Restart to play again!";
    }
  }

  function gameLoop() {
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }

  // Keyboard Event Listener
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault(); // Stop page scrolling on spacebar press
      flap();
    }
  });

  // Mouse / Touch Event Listener on Canvas
  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    flap();
  });

  if (restartBtn) {
    restartBtn.addEventListener("click", startGame);
  }

  // Start the render loop initially
  startGame();
});
