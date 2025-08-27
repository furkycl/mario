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

    type Vec2Type = ReturnType<typeof k.vec2>;

    k.scene("main", () => {
      k.setGravity(1600);

      const JUMP_FORCE = 800;
      const MOVE_SPEED = 240;
      const PLATFORM_WIDTH = 120;
      let score = 0;
      let lastPlatformX = k.width() / 2;
      let dollarsCollected = 0;

      const scoreLabel = k.add([
        k.text("Score: 0", { size: 48 }),
        k.pos(24, 24),
        k.fixed(),
      ]);

      const dollarsLabel = k.add([
        k.text("$: 0", { size: 48 }),
        k.pos(24, 84),
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

      k.add([
        k.rect(10, k.height() * 20),
        k.pos(0, -k.height() * 19),
        k.area(),
        k.body({ isStatic: true }),
      ]);
      k.add([
        k.rect(10, k.height() * 20),
        k.pos(k.width() - 10, -k.height() * 19),
        k.area(),
        k.body({ isStatic: true }),
      ]);
      k.add([
        k.rect(k.width(), 48),
        k.pos(k.width() / 2, k.height() - 24),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      function spawnPlatform(p: Vec2Type) {
        k.add([
          k.rect(PLATFORM_WIDTH, 24),
          k.pos(p),
          k.anchor("center"),
          k.area(),
          k.body({ isStatic: true }),
          "platform",
        ]);

        if (k.rand() < 0.2) {
          k.add([
            k.text("$", { size: 32 }),
            k.color(255, 223, 0),
            k.pos(p.x, p.y - 24),
            k.anchor("center"),
            k.area(),
            "dollar",
          ]);
        }
      }

      for (let i = 1; i < 200; i++) {
        const maxJumpDistance = 300;
        const newX = k.rand(
          Math.max(PLATFORM_WIDTH / 2, lastPlatformX - maxJumpDistance),
          Math.min(
            k.width() - PLATFORM_WIDTH / 2,
            lastPlatformX + maxJumpDistance
          )
        );
        spawnPlatform(k.vec2(newX, k.height() - i * 150));
        lastPlatformX = newX;
      }

      const finishLineY = -9999;
      k.add([
        k.rect(200, 40),
        k.pos(k.width() / 2, finishLineY),
        k.anchor("center"),
        k.color(255, 0, 0),
        k.area(),
        "finish",
      ]);

      k.onKeyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
      });
      k.onKeyDown("right", () => {
        player.move(MOVE_SPEED, 0);
      });
      player.onGround(() => {
        player.jump(JUMP_FORCE);
      });

      player.onCollide("dollar", (d) => {
        k.destroy(d);
        dollarsCollected++;
        dollarsLabel.text = `$: ${dollarsCollected}`;
      });
      player.onCollide("finish", () => {
        k.go("win", score, dollarsCollected);
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

    // ======================================================
    // THE FIX IS HERE
    // ======================================================
    k.scene("lose", (score) => {
      k.add([
        k.text("Game Over", { size: 80 }),
        k.pos(k.width() / 2, k.height() / 2 - 80),
        k.anchor("center"),
      ]);
      k.add([
        // This line now correctly uses the 'score' parameter
        k.text(`Score: ${score}`, { size: 60 }),
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
    // ======================================================

    k.scene("win", (score, dollarsCollected) => {
      k.add([
        k.text("Congratulations!", { size: 80 }),
        k.pos(k.width() / 2, k.height() / 2 - 120),
        k.anchor("center"),
      ]);
      k.add([
        k.text(`Final Score: ${score}`, { size: 60 }),
        k.pos(k.width() / 2, k.height() / 2 - 20),
        k.anchor("center"),
      ]);
      k.add([
        k.text(`Dollars Collected: ${dollarsCollected}`, { size: 60 }),
        k.pos(k.width() / 2, k.height() / 2 + 40),
        k.anchor("center"),
      ]);
      k.add([
        k.text("Press Space to Restart", { size: 40 }),
        k.pos(k.width() / 2, k.height() / 2 + 120),
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
