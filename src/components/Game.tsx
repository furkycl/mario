import { useEffect, useRef } from "react";
import kaboom from "kaboom";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const k = kaboom({
      // 1. Set the new resolution as requested
      width: 1280,
      height: 1024,
      canvas: canvasRef.current,
      background: [20, 20, 30], // A darker, night-sky-like background
    });

    // Main game scene
    k.scene("main", () => {
      k.setGravity(1600); // Gravity is a bit lower for more floaty jumps

      const JUMP_FORCE = 800;
      const MOVE_SPEED = 240;
      let score = 0;

      // Score label UI element
      const scoreLabel = k.add([
        k.text("Score: 0", { size: 48 }),
        k.pos(24, 24),
        k.fixed(), // This makes the score stay on screen, ignoring the camera
      ]);

      // Player character (our trusty black square)
      const player = k.add([
        k.rect(32, 32), // Character is a bit bigger now
        k.pos(k.width() / 2, k.height() - 100), // Start at the bottom center
        k.anchor("center"),
        k.color(255, 255, 255), // Let's make the character white to stand out
        k.body(),
        k.area(),
      ]);

      // Initial platform for the player to stand on
      k.add([
        k.rect(k.width(), 48),
        k.pos(k.width() / 2, k.height() - 24),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      // Function to spawn a new platform
      function spawnPlatform(p) {
        k.add([
          k.rect(120, 24),
          k.pos(p),
          k.anchor("center"),
          k.area(),
          k.body({ isStatic: true }),
          "platform", // Tag for platforms
        ]);
      }

      // Spawn initial platforms
      for (let i = 1; i < 10; i++) {
        spawnPlatform(k.vec2(k.rand(0, k.width()), k.height() - i * 150));
      }

      // Player controls
      k.onKeyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
      });

      k.onKeyDown("right", () => {
        player.move(MOVE_SPEED, 0);
      });

      // Jump when player lands on something
      player.onGround(() => {
        player.jump(JUMP_FORCE);
      });

      // Core game loop
      player.onUpdate(() => {
        // Camera follows the player's vertical position
        k.camPos(k.width() / 2, player.pos.y);

        // Update score based on the highest point reached
        const highestPoint = -player.pos.y;
        if (highestPoint > score) {
          score = Math.floor(highestPoint);
          scoreLabel.text = "Score: " + score;
        }

        // Loss condition: if player falls off the bottom of the camera's view
        if (player.pos.y > k.camPos().y + k.height() / 2) {
          k.go("lose", score); // Go to the 'lose' scene and pass the score
        }
      });
    });

    // "Game Over" scene
    k.scene("lose", (score) => {
      k.add([
        k.text("Game Over", { size: 80 }),
        k.pos(k.width() / 2, k.height() / 2 - 80),
        k.anchor("center"),
      ]);

      k.add([
        k.text("Score: " + score, { size: 60 }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
      ]);

      k.add([
        k.text("Press Space to Restart", { size: 40 }),
        k.pos(k.width() / 2, k.height() / 2 + 80),
        k.anchor("center"),
      ]);

      k.onKeyPress("space", () => {
        k.go("main"); // Restart the game
      });
    });

    k.go("main");
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
