import { useEffect, useRef } from "react";
import kaboom from "kaboom";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isKaboomInitialized = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || isKaboomInitialized.current) {
      return;
    }

    const k = kaboom({
      canvas: canvasRef.current,
      width: 640,
      height: 480,
      scale: 1,
      background: [0, 0, 0],
    });

    k.loadSprite("mario", "/sprites/mario.png");
    k.loadSprite("ground", "/sprites/ground.png");
    k.loadSprite("block", "/sprites/block.png");

    k.scene("main", () => {
      const levelMap = [
        "                    ",
        "                    ",
        "                    ",
        "     %   =*=%=      ",
        "                    ",
        "                    ",
        "   =================",
      ];

      const levelConf = {
        tileWidth: 20,
        tileHeight: 20,
        tiles: {
          "=": () => [k.sprite("ground"), k.area(), k.solid()],
          "%": () => [k.sprite("block"), k.area(), k.solid()],
        },
      };

      k.addLevel(levelMap, levelConf);

      const player = k.add([
        k.sprite("mario"),
        k.pos(30, 0),
        k.area(),
        k.body(),
      ]);

      // ======================================================
      // YENİ EKLENEN KOD BAŞLANGICI
      // ======================================================

      const MOVE_SPEED = 120;
      const JUMP_FORCE = 360;

      // Sağa hareket (sağ ok tuşu basılı tutulduğunda)
      k.onKeyDown("right", () => {
        player.move(MOVE_SPEED, 0);
      });

      // Sola hareket (sol ok tuşu basılı tutulduğunda)
      k.onKeyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
      });

      // Zıplama (boşluk tuşuna basıldığında)
      k.onKeyPress("space", () => {
        // Sadece oyuncu zemindeyse zıpla
        if (player.isGrounded()) {
          player.jump(JUMP_FORCE);
        }
      });

      // ======================================================
      // YENİ EKLENEN KOD SONU
      // ======================================================
    });

    k.go("main");

    isKaboomInitialized.current = true;
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
