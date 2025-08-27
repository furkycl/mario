import { useEffect, useRef } from "react";
import kaboom from "kaboom";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const k = kaboom({
      width: 1280,
      height: 1024,
      canvas: canvasRef.current,
      background: [20, 20, 30],
    });

    k.scene("main", () => {
      k.setGravity(1600);

      const JUMP_FORCE = 800;
      const MOVE_SPEED = 240;
      const PLATFORM_WIDTH = 120;
      let score = 0;
      let lastPlatformX = k.width() / 2; // Keep track of the last platform's X position

      const scoreLabel = k.add([
        k.text("Score: 0", { size: 48 }),
        k.pos(24, 24),
        k.fixed(),
      ]);

      const player = k.add([
        k.rect(32, 32),
        k.pos(k.width() / 2, k.height() - 100),
        k.anchor("center"),
        k.color(255, 255, 255),
        k.body(),
        k.area(),
      ]);

      // ======================================================
      // NEW: Add Walls
      // ======================================================
      // Left Wall
      k.add([
        k.rect(10, k.height() * 2), // A tall, thin rectangle
        k.pos(0, -k.height()), // Positioned on the left edge
        k.area(),
        k.body({ isStatic: true }),
      ]);
      // Right Wall
      k.add([
        k.rect(10, k.height() * 2),
        k.pos(k.width() - 10, -k.height()), // Positioned on the right edge
        k.area(),
        k.body({ isStatic: true }),
      ]);
      // ======================================================

      // Initial platform
      k.add([
        k.rect(k.width(), 48),
        k.pos(k.width() / 2, k.height() - 24),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      function spawnPlatform(p) {
        k.add([
          k.rect(PLATFORM_WIDTH, 24),
          k.pos(p),
          k.anchor("center"),
          k.area(),
          k.body({ isStatic: true }),
          "platform",
        ]);
      }

      // Spawn initial platforms with smarter logic
      for (let i = 1; i < 10; i++) {
        // ======================================================
        // NEW: Smarter Platform Generation Logic
        // ======================================================
        const maxJumpDistance = 300; // Max horizontal distance a player can likely jump

        // Calculate a new X position that is reachable from the previous platform
        const newX = k.rand(
          Math.max(PLATFORM_WIDTH / 2, lastPlatformX - maxJumpDistance),
          Math.min(
            k.width() - PLATFORM_WIDTH / 2,
            lastPlatformX + maxJumpDistance
          )
        );

        spawnPlatform(k.vec2(newX, k.height() - i * 150));
        lastPlatformX = newX; // Update the last platform's position
        // ======================================================
      }

      k.onKeyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
      });

      k.onKeyDown("right", () => {
        player.move(MOVE_SPEED, 0);
      });

      player.onGround(() => {
        player.jump(JUMP_FORCE);
      });

      player.onUpdate(() => {
        k.camPos(k.width() / 2, player.pos.y);

        const highestPoint = -player.pos.y;
        if (highestPoint > score) {
          score = Math.floor(highestPoint);
          scoreLabel.text = "Score: " + score;
        }

        if (player.pos.y > k.camPos().y + k.height() / 2) {
          k.go("lose", score);
        }
      });
    });

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
        k.go("main");
      });
    });

    k.go("main");
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
