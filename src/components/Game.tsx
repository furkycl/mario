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
      background: [200, 200, 200],
    });

    k.scene("main", () => {
      k.setGravity(2400);

      const GROUND_HEIGHT = 20;

      k.add([
        k.rect(k.width(), GROUND_HEIGHT),
        k.pos(0, k.height() - GROUND_HEIGHT),
        k.body({ isStatic: true }),
        k.area(),
        "ground",
      ]);

      const player = k.add([
        k.rect(16, 16),
        k.pos(40, k.height() - GROUND_HEIGHT),
        k.anchor("botleft"),
        k.color(0, 0, 0),
        k.body(),
        k.area(),
      ]);

      player.onUpdate(() => {
        k.camPos(player.pos);
      });

      const MOVE_SPEED = 120;
      const JUMP_FORCE = 360;

      k.onKeyDown("right", () => {
        player.move(MOVE_SPEED, 0);
      });

      k.onKeyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
      });

      k.onKeyPress("space", () => {
        if (player.isGrounded()) {
          player.jump(JUMP_FORCE);
        }
      });
    });

    k.go("main");
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
