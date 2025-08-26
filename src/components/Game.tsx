import { useEffect, useRef } from "react";
import kaboom from "kaboom";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const k = kaboom({
      canvas: canvasRef.current,
      width: 640,
      height: 480,
      scale: 1,
      background: [51, 153, 255], // Gökyüzü mavisi bir arka plan
    });

    // Varlıkları yükle
    k.loadSprite("mario", "/sprites/mario.png");
    k.loadSprite("ground", "/sprites/ground.png");
    k.loadSprite("block", "/sprites/block.png");

    // Ana oyun sahnesi
    k.scene("main", () => {
      // Daha uzun ve oynaması keyifli bir harita
      const levelMap = [
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "     %   =*=%                         ",
        "                                      ",
        "                           ====       ",
        "   ========   ====   ======           ",
      ];

      const levelConf = {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
          "=": () => [k.sprite("ground"), k.area(), k.body({ isStatic: true })],
          "%": () => [k.sprite("block"), k.area(), k.body({ isStatic: true })],
        },
      };

      k.addLevel(levelMap, levelConf);

      const player = k.add([
        k.sprite("mario"),
        k.pos(30, 0), // Başlangıç pozisyonu
        k.area(),
        k.body(),
      ]);

      const MOVE_SPEED = 120;
      const JUMP_FORCE = 360;

      // Oyuncu her güncellendiğinde (her karede) kamerayı takip et
      player.onUpdate(() => {
        k.camPos(player.pos);
      });

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
