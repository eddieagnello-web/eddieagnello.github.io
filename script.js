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

  // --- SNAKE ARENA GAME ENGINE ---
  const canvas = document.getElementById("snakeCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const gameStatusMessage = document.getElementById("gameStatusMessage");
  const restartBtn = document.getElementById("restartSnakeBtn");

  const gridSize = 20; // Size of each grid block in pixels
  const tileCount = canvas.width / gridSize; // 20 tiles wide x 20 tiles high

  // Game state variables
  let player = {
    body: [],
    dx: gridSize,
    dy: 0,
    score: 0,
    alive: true
  };

  let aiSnakes = [];
  let food = { x: 0, y: 0 };
  let gameInterval = null;
  let gameRunning = false;

  // Initialize and start a brand new game session
  function startGame() {
    // Reset player snake
    player.body = [
      { x: 5 * gridSize, y: 10 * gridSize },
      { x: 4 * gridSize, y: 10 * gridSize },
      { x: 3 * gridSize, y: 10 * gridSize }
    ];
    player.dx = gridSize;
    player.dy = 0;
    player.score = 0;
    player.alive = true;

    // Reset AI bot opponents
    aiSnakes = [
      {
        id: "Bot Alpha",
        color: "#ff4757", // Red
        body: [
          { x: 15 * gridSize, y: 5 * gridSize },
          { x: 16 * gridSize, y: 5 * gridSize }
        ],
        dx: -gridSize,
        dy: 0,
        alive: true
      },
      {
        id: "Bot Beta",
        color: "#ffa502", // Orange
        body: [
          { x: 15 * gridSize, y: 15 * gridSize },
          { x: 15 * gridSize, y: 16 * gridSize }
        ],
        dx: 0,
        dy: -gridSize,
        alive: true
      }
    ];

    if (scoreDisplay) scoreDisplay.textContent = player.score;
    if (gameStatusMessage) gameStatusMessage.textContent = "🎮 Battle in progress! Eat food to grow!";

    spawnFood();
    gameRunning = true;

    // Clear any previous running loop and set interval to run every 120ms
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 120);
  }

  // Spawn food at a random position not currently occupied
  function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = Math.floor(Math.random() * tileCount) * gridSize;
  }

  // AI Logic: Determines smart next direction for computer bots
  function getAIMove(bot) {
    const head = bot.body[0];
    const directions = [
      { dx: gridSize, dy: 0 },
      { dx: -gridSize, dy: 0 },
      { dx: 0, dy: gridSize },
      { dx: 0, dy: -gridSize }
    ];

    // Filter out reversing directly backwards into body
    const validDirections = directions.filter(dir => !(dir.dx === -bot.dx && dir.dy === -bot.dy));

    let bestDir = validDirections[0];
    let minDistance = Infinity;

    // Check each direction for safe tiles closer to food
    validDirections.forEach(dir => {
      const nextX = head.x + dir.dx;
      const nextY = head.y + dir.dy;

      // Ensure the move stays inside arena borders
      if (nextX >= 0 && nextX < canvas.width && nextY >= 0 && nextY < canvas.height) {
        const dist = Math.hypot(nextX - food.x, nextY - food.y);
        if (dist < minDistance) {
          minDistance = dist;
          bestDir = dir;
        }
      }
    });

    return bestDir;
  }

  // Main tick loop that updates positions and renders the frame
  function gameLoop() {
    if (!gameRunning) return;

    // 1. Move Player Snake
    if (player.alive) {
      const newHead = { x: player.body[0].x + player.dx, y: player.body[0].y + player.dy };

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        player.alive = false;
      }

      // Check self-collision
      for (let segment of player.body) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
          player.alive = false;
        }
      }

      // Check collision with AI snake bodies
      aiSnakes.forEach(bot => {
        if (bot.alive) {
          bot.body.forEach(segment => {
            if (newHead.x === segment.x && newHead.y === segment.y) {
              player.alive = false;
            }
          });
        }
      });

      if (player.alive) {
        player.body.unshift(newHead);

        // Check if player eats food
        if (newHead.x === food.x && newHead.y === food.y) {
          player.score += 10;
          if (scoreDisplay) scoreDisplay.textContent = player.score;
          spawnFood();
        } else {
          player.body.pop(); // Remove tail if no food eaten
        }
      }
    }

    // 2. Move AI Opponents
    aiSnakes.forEach(bot => {
      if (!bot.alive) return;

      const nextMove = getAIMove(bot);
      if (nextMove) {
        bot.dx = nextMove.dx;
        bot.dy = nextMove.dy;
      }

      const botHead = { x: bot.body[0].x + bot.dx, y: bot.body[0].y + bot.dy };

      // AI wall collision check
      if (botHead.x < 0 || botHead.x >= canvas.width || botHead.y < 0 || botHead.y >= canvas.height) {
        bot.alive = false;
        return;
      }

      bot.body.unshift(botHead);

      // Check if AI eats food
      if (botHead.x === food.x && botHead.y === food.y) {
        spawnFood();
      } else {
        bot.body.pop();
      }
    });

    // Check if game ends (Player died)
    if (!player.alive) {
      gameRunning = false;
      clearInterval(gameInterval);
      if (gameStatusMessage) gameStatusMessage.textContent = "💥 Game Over! You crashed. Press Restart to try again!";
    }

    draw();
  }

  // Draw graphics onto canvas
  function draw() {
    // Fill canvas background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw glowing Food dot
    ctx.fillStyle = "#2ed573";
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Player Snake (Cyan / Blue)
    if (player.alive) {
      player.body.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#00d2d3" : "#54a0ff";
        ctx.fillRect(segment.x + 1, segment.y + 1, gridSize - 2, gridSize - 2);
      });
    }

    // Draw AI Bot Snakes (Red & Orange)
    aiSnakes.forEach(bot => {
      if (bot.alive) {
        bot.body.forEach((segment, index) => {
          ctx.fillStyle = bot.color;
          ctx.fillRect(segment.x + 1, segment.y + 1, gridSize - 2, gridSize - 2);
        });
      }
    });
  }

  // Keyboard Event Listener with e.preventDefault() so page doesn't scroll when playing!
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
      e.preventDefault(); // Prevents browser scrolling while using game keys
    }

    if ((key === "arrowup" || key === "w") && player.dy === 0) {
      player.dx = 0;
      player.dy = -gridSize;
    } else if ((key === "arrowdown" || key === "s") && player.dy === 0) {
      player.dx = 0;
      player.dy = gridSize;
    } else if ((key === "arrowleft" || key === "a") && player.dx === 0) {
      player.dx = -gridSize;
      player.dy = 0;
    } else if ((key === "arrowright" || key === "d") && player.dx === 0) {
      player.dx = gridSize;
      player.dy = 0;
    }
  });

  // Attach button click event to start game
  if (restartBtn) {
    restartBtn.addEventListener("click", startGame);
  }

  // Draw initial blank state on load
  draw();
});
