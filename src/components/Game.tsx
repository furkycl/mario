import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import { KaboomCtx } from "kaboom";

// Game bileşeni
const Game = () => {
  // Canvas elementine referans oluşturuyoruz.
  // Bu, React'in DOM'a doğrudan erişmesini sağlar.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect, bileşen ekrana ilk kez çizildiğinde çalışır.
  // Oyunumuzu burada başlatacağız.
  useEffect(() => {
    // Eğer canvasRef mevcutsa, Kaboom'u başlat.
    if (canvasRef.current) {
      const k: KaboomCtx = kaboom({
        canvas: canvasRef.current,
        width: 640,
        height: 480,
        scale: 1,
        background: [0, 0, 0], // Siyah arka plan
      });

      // --- OYUN MANTIĞI BURAYA GELECEK ---
      // Şimdilik sadece bir test metni ekleyelim.
      k.add([
        k.text("Oyun Başladı!"),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
      ]);
      // ------------------------------------
    }
  }, []); // Boş dependency array, bu etkinin sadece bir kez çalışmasını sağlar.

  // Ekrana çizilecek olan canvas elementini döndürüyoruz.
  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
