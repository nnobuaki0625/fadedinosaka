import React, { useRef, useEffect, useState, useCallback } from 'react';

const GAME_W = 800;
const GAME_H = 400;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const LEVEL_LENGTH = 6000;
const TIME_LIMIT = 60;

// Colors
const C = {
  bg: '#050505',
  ground: '#1A1A2E',
  groundLine: '#FF003C',
  building: '#0a0a14',
  buildingEdge: '#1a1a30',
  neonPink: '#FF003C',
  neonCyan: '#00d4ff',
  neonPurple: '#8b00ff',
  silver: '#E2E2E2',
  dark: '#080810',
  rain: 'rgba(100,150,255,0.15)',
  sign: '#ff6600',
};

function generateLevel() {
  const platforms = [
    { x: 0, y: GAME_H - 40, w: 600, h: 40 },
    { x: 700, y: GAME_H - 40, w: 200, h: 40 },
    { x: 500, y: GAME_H - 110, w: 120, h: 16 },
    { x: 1000, y: GAME_H - 40, w: 300, h: 40 },
    { x: 1050, y: GAME_H - 130, w: 80, h: 16 },
    { x: 1400, y: GAME_H - 40, w: 150, h: 40 },
    { x: 1350, y: GAME_H - 150, w: 100, h: 16 },
    { x: 1650, y: GAME_H - 80, w: 80, h: 16 },
    { x: 1800, y: GAME_H - 40, w: 400, h: 40 },
    { x: 1900, y: GAME_H - 120, w: 80, h: 16 },
    { x: 2300, y: GAME_H - 40, w: 200, h: 40 },
    { x: 2350, y: GAME_H - 140, w: 100, h: 16 },
    { x: 2600, y: GAME_H - 80, w: 60, h: 16 },
    { x: 2750, y: GAME_H - 120, w: 60, h: 16 },
    { x: 2900, y: GAME_H - 40, w: 300, h: 40 },
    { x: 3300, y: GAME_H - 40, w: 150, h: 40 },
    { x: 3250, y: GAME_H - 130, w: 80, h: 16 },
    { x: 3550, y: GAME_H - 70, w: 80, h: 16 },
    { x: 3700, y: GAME_H - 110, w: 80, h: 16 },
    { x: 3850, y: GAME_H - 40, w: 400, h: 40 },
    { x: 4350, y: GAME_H - 40, w: 200, h: 40 },
    { x: 4400, y: GAME_H - 130, w: 100, h: 16 },
    { x: 4650, y: GAME_H - 80, w: 60, h: 16 },
    { x: 4800, y: GAME_H - 120, w: 60, h: 16 },
    { x: 4950, y: GAME_H - 40, w: 400, h: 40 },
    { x: 5450, y: GAME_H - 40, w: 550, h: 40 },
  ];

  const buildings = [];
  for (let i = 0; i < LEVEL_LENGTH; i += 120 + Math.random() * 100) {
    const h = 80 + Math.random() * 180;
    buildings.push({ x: i, w: 40 + Math.random() * 60, h, neon: Math.random() > 0.5 });
  }

  const signs = [];
  for (let i = 300; i < LEVEL_LENGTH; i += 400 + Math.random() * 300) {
    signs.push({ x: i, y: 40 + Math.random() * 80, text: ['ゲーム', '大阪', 'ネオン', 'アーケード', '夜', '電気'][Math.floor(Math.random() * 6)] });
  }

  return { platforms, buildings, signs };
}

function generateRaindrops() {
  const drops = [];
  for (let i = 0; i < 80; i++) {
    drops.push({ x: Math.random() * GAME_W, y: Math.random() * GAME_H, speed: 2 + Math.random() * 4, len: 4 + Math.random() * 8 });
  }
  return drops;
}

export default function GameCanvas({ onWin, onLose }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const keysRef = useRef({});
  const touchRef = useRef({ left: false, right: false, jump: false });
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [started, setStarted] = useState(false);
  const animRef = useRef(null);

  const initGame = useCallback(() => {
    const level = generateLevel();
    const rain = generateRaindrops();
    gameRef.current = {
      player: { x: 60, y: GAME_H - 80, w: 16, h: 24, vx: 0, vy: 0, onGround: false, facing: 1 },
      camera: { x: 0 },
      level,
      rain,
      time: TIME_LIMIT,
      frame: 0,
      done: false,
      won: false,
    };
  }, []);

  useEffect(() => {
    initGame();
    setStarted(true);
  }, [initGame]);

  useEffect(() => {
    const handleKey = (e, down) => {
      keysRef.current[e.key.toLowerCase()] = down;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const kd = (e) => handleKey(e, true);
    const ku = (e) => handleKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, []);

  // Timer
  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (gameRef.current && !gameRef.current.won) {
            gameRef.current.done = true;
            onLose();
          }
          return 0;
        }
        if (gameRef.current) gameRef.current.time = prev - 1;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, onLose]);

  // Game loop
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const g = gameRef.current;
      if (!g || g.done) return;

      const keys = keysRef.current;
      const touch = touchRef.current;
      const p = g.player;

      // Input
      if (keys['arrowleft'] || keys['a'] || touch.left) { p.vx = -MOVE_SPEED; p.facing = -1; }
      else if (keys['arrowright'] || keys['d'] || touch.right) { p.vx = MOVE_SPEED; p.facing = 1; }
      else { p.vx = 0; }

      if ((keys['arrowup'] || keys['w'] || keys[' '] || touch.jump) && p.onGround) {
        p.vy = JUMP_FORCE;
        p.onGround = false;
      }

      // Physics
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.onGround = false;

      // Platform collision
      for (const plat of g.level.platforms) {
        if (p.x + p.w > plat.x && p.x < plat.x + plat.w && p.y + p.h > plat.y && p.y + p.h < plat.y + plat.h + 12 && p.vy >= 0) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.onGround = true;
        }
      }

      // Fall death
      if (p.y > GAME_H + 50) {
        p.x = 60; p.y = GAME_H - 80; p.vx = 0; p.vy = 0;
      }

      // Win condition
      if (p.x > LEVEL_LENGTH - 100) {
        g.done = true;
        g.won = true;
        onWin();
        return;
      }

      // Camera
      g.camera.x = Math.max(0, p.x - GAME_W / 3);

      // Rain update
      g.rain.forEach(d => {
        d.y += d.speed;
        d.x -= 1;
        if (d.y > GAME_H) { d.y = -10; d.x = Math.random() * (GAME_W + 200); }
      });

      g.frame++;

      // === RENDER ===
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      const cx = g.camera.x;

      // Far buildings (parallax)
      g.level.buildings.forEach(b => {
        const bx = b.x * 0.4 - cx * 0.4;
        if (bx > -b.w && bx < GAME_W + 10) {
          ctx.fillStyle = C.dark;
          ctx.fillRect(bx, GAME_H - b.h - 40, b.w, b.h);
          if (b.neon) {
            ctx.fillStyle = g.frame % 60 < 45 ? C.neonPink + '30' : C.neonCyan + '20';
            ctx.fillRect(bx + 4, GAME_H - b.h - 30, b.w - 8, 4);
          }
        }
      });

      // Mid buildings (parallax)
      g.level.buildings.forEach(b => {
        const bx = b.x * 0.7 - cx * 0.7;
        if (bx > -b.w - 10 && bx < GAME_W + 10) {
          ctx.fillStyle = C.building;
          ctx.fillRect(bx, GAME_H - b.h * 0.6 - 40, b.w * 0.8, b.h * 0.6);
          // Windows
          for (let wy = GAME_H - b.h * 0.6 - 30; wy < GAME_H - 50; wy += 16) {
            for (let wx = bx + 4; wx < bx + b.w * 0.8 - 8; wx += 10) {
              ctx.fillStyle = Math.random() > 0.6 ? '#ffcc0015' : '#00000000';
              ctx.fillRect(wx, wy, 4, 6);
            }
          }
        }
      });

      // Neon signs
      g.level.signs.forEach(s => {
        const sx = s.x - cx;
        if (sx > -80 && sx < GAME_W + 80) {
          const flicker = g.frame % 90 < 80;
          ctx.fillStyle = flicker ? C.neonPink : C.neonPink + '40';
          ctx.font = '14px sans-serif';
          ctx.fillText(s.text, sx, s.y);
          if (flicker) {
            ctx.shadowColor = C.neonPink;
            ctx.shadowBlur = 15;
            ctx.fillText(s.text, sx, s.y);
            ctx.shadowBlur = 0;
          }
        }
      });

      // Platforms
      g.level.platforms.forEach(plat => {
        const px = plat.x - cx;
        if (px > -plat.w && px < GAME_W + 10) {
          ctx.fillStyle = C.ground;
          ctx.fillRect(px, plat.y, plat.w, plat.h);
          ctx.fillStyle = C.groundLine;
          ctx.fillRect(px, plat.y, plat.w, 2);
          // Edge glow
          ctx.fillStyle = C.neonPink + '15';
          ctx.fillRect(px, plat.y - 4, plat.w, 4);
        }
      });

      // Rain
      ctx.strokeStyle = C.rain;
      ctx.lineWidth = 1;
      g.rain.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.stroke();
      });

      // Player
      const ppx = p.x - cx;
      const ppy = p.y;
      // Body
      ctx.fillStyle = C.silver;
      ctx.fillRect(ppx + 4, ppy, 8, 14);
      // Head
      ctx.fillRect(ppx + 3, ppy - 6, 10, 8);
      // Eyes
      ctx.fillStyle = C.neonCyan;
      ctx.fillRect(p.facing > 0 ? ppx + 9 : ppx + 3, ppy - 3, 3, 2);
      // Legs
      const legAnim = g.frame % 10 < 5 && Math.abs(p.vx) > 0;
      ctx.fillStyle = C.silver;
      ctx.fillRect(ppx + 4, ppy + 14, 3, legAnim ? 8 : 10);
      ctx.fillRect(ppx + 9, ppy + 14, 3, legAnim ? 10 : 8);

      // Player glow
      ctx.shadowColor = C.neonCyan;
      ctx.shadowBlur = 8;
      ctx.fillStyle = C.neonCyan + '10';
      ctx.fillRect(ppx - 2, ppy - 8, 20, 34);
      ctx.shadowBlur = 0;

      // VHS tracking glitch (occasional)
      if (g.frame % 300 > 290) {
        const gy = Math.random() * GAME_H;
        const gh = 4 + Math.random() * 8;
        const imgData = ctx.getImageData(0, gy, GAME_W, gh);
        ctx.putImageData(imgData, Math.random() * 10 - 5, gy + 2);
      }

      // Scanlines
      for (let i = 0; i < GAME_H; i += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)';
        ctx.fillRect(0, i, GAME_W, 1);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [started, onWin, onLose]);

  return (
    <div className="relative w-full">
      {/* VCR Timer */}
      <div className="absolute top-3 left-0 right-0 z-20 flex justify-center">
        <div className="bg-obsidian/80 border border-silver/10 px-4 py-1.5 flex items-center gap-3">
          <span className="font-mono text-[10px] text-silver/40 tracking-widest">TIME</span>
          <span className={`font-pixel text-sm tracking-widest ${timeLeft <= 10 ? 'text-crimson' : 'text-cyan'}`} style={{ textShadow: timeLeft <= 10 ? '0 0 10px #FF003C' : '0 0 10px #00d4ff' }}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-silver/5 z-20">
        <div
          className="h-full bg-crimson transition-all duration-300"
          style={{ width: `${Math.min(100, ((gameRef.current?.player?.x || 0) / LEVEL_LENGTH) * 100)}%` }}
        />
      </div>

      {/* CRT Frame */}
      <div className="relative border-2 border-silver/10 bg-obsidian overflow-hidden" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5)' }}>
        <canvas
          ref={canvasRef}
          width={GAME_W}
          height={GAME_H}
          className="w-full h-auto block"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Mobile controls */}
      <div className="md:hidden flex justify-between items-center mt-4 px-4">
        <div className="flex gap-2">
          <button
            onTouchStart={() => { touchRef.current.left = true; }}
            onTouchEnd={() => { touchRef.current.left = false; }}
            className="w-14 h-14 border border-silver/20 bg-obsidian/80 text-silver font-pixel text-xs flex items-center justify-center active:bg-crimson/20"
          >
            ◀
          </button>
          <button
            onTouchStart={() => { touchRef.current.right = true; }}
            onTouchEnd={() => { touchRef.current.right = false; }}
            className="w-14 h-14 border border-silver/20 bg-obsidian/80 text-silver font-pixel text-xs flex items-center justify-center active:bg-crimson/20"
          >
            ▶
          </button>
        </div>
        <button
          onTouchStart={() => { touchRef.current.jump = true; }}
          onTouchEnd={() => { touchRef.current.jump = false; }}
          className="w-16 h-16 border border-crimson/40 bg-obsidian/80 text-crimson font-pixel text-xs flex items-center justify-center active:bg-crimson/20 rounded-full"
        >
          JUMP
        </button>
      </div>

      {/* Controls hint */}
      <div className="hidden md:flex justify-center mt-4 gap-6 font-mono text-[10px] text-silver/25 tracking-widest">
        <span>← → MOVE</span>
        <span>↑ / SPACE JUMP</span>
      </div>
    </div>
  );
}