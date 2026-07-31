// Wait for the HTML elements to finish loading before running script
document.addEventListener("DOMContentLoaded", () => {
  
  // --- EXISTING FEATURES: Dark Mode & Magic Button ---
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

  // --- SNAKE ARENA VS AI GAME LOGIC ---
  const canvas = document.getElementById("snakeCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const gameStatusMessage = document.getElementById("gameStatusMessage");
  const restartBtn = document.getElementById("restartSnakeBtn");

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  // Player state
  let player = {
    body: [],
    dx: gridSize,
    dy: 0,
    score: 0,
    alive: true
  };

  // AI Opponents state array
  let aiSnakes = [];
  let food = { x: 0, y: 0 };
  let gameInterval = null;

  // Initialize and start the game loop
  function startGame() {
    // Player spawn (Green/Cyan)
    player.body = [
      { x: 5 * gridSize, y: 5 * gridSize },
      { x: 4 * gridSize, y: 5 * gridSize },
      { x: 3 * gridSize, y: 5 * gridSize }
    ];
    player.dx = gridSize;
    player.dy = 0;
    player.score = 0;
    player.alive = true;

    // AI Bots spawn (Red & Purple opponents)
    aiSnakes = [
      {
        id: "Bot Alpha",
        color: "#ff4757", // Red
        body: [
          { x: 15 * gridSize, y: 15 * gridSize },
          { x: 16 * gridSize, y: 15 * gridSize }
        ],
        dx: -gridSize,
        dy: 0,
        alive: true
      },
      {
        id: "Bot Beta",
        color: "#ffa502", // Orange
        body: [
          { x: 15 * gridSize, y: 5 * gridSize },
          { x: 15 * gridSize, y: 6 * gridSize }
        ],
        dx: 0,
        dy: -gridSize,
        alive: true
      }
    ];

    if (scoreDisplay) scoreDisplay.textContent = player.score;
    if (gameStatusMessage) gameStatusMessage.textContent = "Battle in progress! Beat the AI bots!";

    spawnFood();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 110);
  }

  // Spawn glowing food at random position
  function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = Math.floor(Math.random() * tileCount) * gridSize;
  }

  // Decide AI next move direction towards the food while attempting basic obstacle avoidance
  function updateAIMovement(bot) {
    if (!bot.alive) return;

    const head = bot.body[0];
    let possibleMoves = [
      { dx: gridSize, dy: 0 },
      { dx: -gridSize, dy: 0 },
      { dx: 0, dy: gridSize },
      { dx: 0, dy: -gridSize }
    ];

    // Filter out reversing into its own neck
    possibleMoves = possibleMoves.filter(m => !(m.dx === -bot.dx && m.dy === -bot.dy));

    // Simple pathfinding: Pick the move that brings bot closest to food without hitting walls
    let bestMove = possibleMoves[0];
    let bestDistance = Infinity;

    possibleMoves.forEach(move => {
      const nextX = head.x + move.dx;
      const nextY = head.y + move.dy;

      // Check wall boundary safety
      if (nextX >= 0 && nextX < canvas.width && nextY >= 0 && nextY < canvas.height) {
        const dist = Math.hypot(nextX - food.x, nextY - food.y);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestMove = move;
        }
      }
    });

    if (bestMove) {
      bot.dx = bestMove.dx;
      bot.dy = bestMove.dy;
    }
  }

  // Main game tick loop
  function gameLoop() {
    // 1. Move Player
    if (player.alive) {
      const pHead = { x: player.body[0].x + player.dx, y: player.body[0].y + player.dy };

      // Wall collision check
      if (pHead.x < 0 || pHead.x >= canvas.width || pHead.y < 0 || pHead.y >= canvas.height) {
        player.alive = false;
      }

      // Self-collision check
      for (let segment of player.body) {
        if (pHead.x === segment.x && pHead.y === segment.y) player.alive = false;
      }

      if (player.alive) {
        player.body.unshift(pHead);
        if (pHead.x === food.x && pHead.y === food.y) {
          player.score += 10;
          if (scoreDisplay) scoreDisplay.textContent = player.score;
          spawnFood();
        } else {
          player.body.pop();
        }
      }
    }

    // 2. Move AI Snakes
    aiSnakes.forEach(bot => {
      if (!bot.alive) return;

      updateAIMovement(bot);

      const botHead = { x: bot.body[0].x + bot.dx, y: bot.body[0].y + bot.dy };

      // AI Wall Collision
      if (botHead.x < 0 || botHead.x >= canvas.width || botHead.y < 0 || botHead.y >= canvas.height) {
        bot.alive = false;
        return;
      }

      bot.body.unshift(botHead);
      if (botHead.x === food.x && botHead.y === food.y) {
        spawnFood();
      } else {
        bot.body.pop();
      }
    });

    // Check if player died
    if (!player.alive) {
      clearInterval(gameInterval);
      if (gameStatusMessage) gameStatusMessage.textContent = "💥 Game Over! The AI survived. Try again!";
    }

    draw();
  }

  // Render game elements on canvas
  function draw() {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = "#2ed573";
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Player Snake (Blue / Cyan)
    if (player.alive) {
      player.body.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? "#00d2d3" : "#54a0ff";
        ctx.fillRect(seg.x + 1, seg.y + 1, gridSize - 2, gridSize - 2);
      });
    }

    // Draw AI Snakes
    aiSnakes.forEach(bot => {
      if (bot.alive) {
        bot.body.forEach(seg => {
          ctx.fillStyle = bot.color;
          ctx.fillRect(seg.x + 1, seg.y + 1, gridSize - 2, gridSize - 2);
        });
      }
    });
  }

  // Keyboard controls for player
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
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

  if (restartBtn) restartBtn.addEventListener("click", startGame);

  draw();
});
