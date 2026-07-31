"use client";

import { useEffect, useState, useRef } from "react";

const FRAME_SIZE = 16;
const SCALE = 6;
const SPEED = 2; // Tốc độ di chuyển

const CHARACTERS = [
  { name: "V-Mage", file: "Necromancer_16x16.png", color: "text-purple-400", glow: "bg-purple-500/40" },
  { name: "V-Toad", file: "Toad_16x16.png", color: "text-green-400", glow: "bg-green-500/40" },
  { name: "V-Bear", file: "Bear_16x16.png", color: "text-amber-400", glow: "bg-amber-500/40" },
  { name: "V-Ghost", file: "Ghost_16x16.png", color: "text-tertiary", glow: "bg-tertiary/40" },
  { name: "V-Imp", file: "Imp_16x16.png", color: "text-red-400", glow: "bg-red-500/40" },
];

export default function AnimatedPet() {
  const [frame, setFrame] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  
  // Tọa độ và hướng di chuyển
  const [position, setPosition] = useState({ x: 40, y: 40 }); // Cách lề phải/dưới 40px
  const [direction, setDirection] = useState(2); // 0: down, 1: up, 2: left, 3: right
  const [isMoving, setIsMoving] = useState(false);
  
  const currentChar = CHARACTERS[charIndex];
  const requestRef = useRef<number>();
  
  // Logic di chuyển ngẫu nhiên
  useEffect(() => {
    let targetX = position.x;
    let targetY = position.y;
    let idleTimeout: NodeJS.Timeout;
    
    const pickNewTarget = () => {
      // Chọn tọa độ ngẫu nhiên ở góc dưới bên phải màn hình (vùng hoạt động của pet)
      targetX = Math.floor(Math.random() * 300) + 20; 
      targetY = Math.floor(Math.random() * 200) + 20;
      setIsMoving(true);
    };

    const updatePosition = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let dx = targetX - prev.x;
        let dy = targetY - prev.y;
        
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < SPEED) {
          setIsMoving(false);
          // Đợi 2-5s rồi đi tiếp
          clearTimeout(idleTimeout);
          idleTimeout = setTimeout(pickNewTarget, Math.random() * 3000 + 2000);
          return { x: targetX, y: targetY };
        }
        
        // Di chuyển một bước
        newX += (dx / dist) * SPEED;
        newY += (dy / dist) * SPEED;
        
        // Xác định hướng nhìn (direction)
        if (Math.abs(dx) > Math.abs(dy)) {
          setDirection(dx > 0 ? 2 : 3); // dx > 0 đi sang trái (vì x là khoảng cách lề phải) => direction 2 (left)
        } else {
          setDirection(dy > 0 ? 1 : 0); // dy > 0 đi lên trên (vì y là lề dưới) => direction 1 (up)
        }
        
        return { x: newX, y: newY };
      });
      
      requestRef.current = requestAnimationFrame(updatePosition);
    };
    
    // Khởi động loop
    idleTimeout = setTimeout(pickNewTarget, 2000);
    requestRef.current = requestAnimationFrame(updatePosition);
    
    return () => {
      cancelAnimationFrame(requestRef.current!);
      clearTimeout(idleTimeout);
    };
  }, []);

  // Frame animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (!isMoving) return 0; // Đứng im thì frame 0
        return (prev + 1) % 4;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isMoving]);

  const changeCharacter = () => {
    setCharIndex((prev) => (prev + 1) % CHARACTERS.length);
  };

  // bgX: cột (frame), bgY: hàng (direction)
  const bgX = -(frame * FRAME_SIZE);
  const bgY = -(direction * FRAME_SIZE);

  return (
    <div 
      className="fixed z-50 flex flex-col items-center justify-end group transition-all"
      style={{
        right: `${position.x}px`,
        bottom: `${position.y}px`,
        width: FRAME_SIZE * SCALE,
      }}
    >
      {/* Speech bubble */}
      <div className="absolute bottom-full mb-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 bg-surface/90 backdrop-blur-sm p-3 rounded-2xl rounded-br-none border border-white/20 shadow-2xl text-xs text-white w-48 text-center pointer-events-none z-10">
        Hi! Mình là <span className={`${currentChar.color} font-bold`}>{currentChar.name}</span>.
        <br />
        Bôi đen slide để hỏi mình nhé!
        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/50">
          (Click vào mình để đổi)
        </div>
      </div>
      
      {/* Character Wrapper for correct scaling */}
      <div style={{ width: FRAME_SIZE * SCALE, height: FRAME_SIZE * SCALE }} className="relative flex justify-center items-end">
        <div 
          onClick={changeCharacter}
          className="cursor-pointer hover:brightness-125 hover:-translate-y-2 active:scale-95 transition-all z-10"
          style={{
            width: FRAME_SIZE,
            height: FRAME_SIZE,
            backgroundImage: `url('/sprites/${currentChar.file}')`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            backgroundRepeat: 'no-repeat',
            transform: `scale(${SCALE})`,
            transformOrigin: 'bottom center',
            imageRendering: 'pixelated',
          }}
        />
        {/* Glow effect under the character */}
        <div className={`absolute bottom-0 w-10 h-3 rounded-full blur-md transition-colors duration-500 ${currentChar.glow}`}></div>
      </div>
    </div>
  );
}
