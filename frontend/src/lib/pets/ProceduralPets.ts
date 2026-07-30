const distance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function solveIK(base: {x: number, y: number}, target: {x: number, y: number}, len1: number, len2: number, flip: boolean) {
  const dx = target.x - base.x;
  const dy = target.y - base.y;
  let dist = Math.hypot(dx, dy);
  
  if (dist > len1 + len2) {
    target.x = base.x + (dx / dist) * (len1 + len2 - 0.01);
    target.y = base.y + (dy / dist) * (len1 + len2 - 0.01);
    dist = len1 + len2 - 0.01;
  }

  const angleBaseToTarget = Math.atan2(dy, dx);
  const angle1 = Math.acos((len1 * len1 + dist * dist - len2 * len2) / (2 * len1 * dist)) || 0;
  
  const dir = flip ? -1 : 1;
  const jointAngle = angleBaseToTarget + angle1 * dir;
  
  return {
    x: base.x + Math.cos(jointAngle) * len1,
    y: base.y + Math.sin(jointAngle) * len1
  };
}

class Leg {
  body: Creature;
  offsetX: number;
  offsetY: number;
  length1: number;
  length2: number;
  flip: boolean;
  foot: {x: number, y: number};
  targetFoot: {x: number, y: number};
  isStepping: boolean;
  stepProgress: number;
  stepOrigin: {x: number, y: number};
  maxReach: number;

  constructor(body: Creature, offsetX: number, offsetY: number, length1: number, length2: number, flip: boolean) {
    this.body = body;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.length1 = length1;
    this.length2 = length2;
    this.flip = flip;
    
    this.foot = { x: 0, y: 0 };
    this.targetFoot = { x: 0, y: 0 };
    this.isStepping = false;
    this.stepProgress = 0;
    this.stepOrigin = { x: 0, y: 0 };
    this.maxReach = this.length1 + this.length2;
  }

  getBase() {
    const cos = Math.cos(this.body.angle);
    const sin = Math.sin(this.body.angle);
    return {
      x: this.body.pos.x + this.offsetX * cos - this.offsetY * sin,
      y: this.body.pos.y + this.offsetX * sin + this.offsetY * cos
    };
  }

  getIdealFoot() {
    const base = this.getBase();
    const reach = (this.length1 + this.length2) * 0.6;
    const cos = Math.cos(this.body.angle);
    const sin = Math.sin(this.body.angle);
    // Ideal foot is pushed out to the side
    const pushY = this.flip ? reach : -reach;
    const pushX = this.offsetX > 0 ? reach * 0.5 : -reach * 0.5; // push forward/back slightly
    
    return {
      x: base.x + pushX * cos - pushY * sin,
      y: base.y + pushX * sin + pushY * cos
    };
  }

  update(stepSpeed: number) {
    const ideal = this.getIdealFoot();
    const dist = distance(this.foot, ideal);

    if (!this.isStepping && dist > this.maxReach * 0.5) {
      return true; 
    }

    if (this.isStepping) {
      this.stepProgress += stepSpeed;
      if (this.stepProgress >= 1) {
        this.stepProgress = 1;
        this.isStepping = false;
      }

      this.foot.x = lerp(this.stepOrigin.x, this.targetFoot.x, this.stepProgress);
      this.foot.y = lerp(this.stepOrigin.y, this.targetFoot.y, this.stepProgress);
      
      const heightLift = Math.sin(this.stepProgress * Math.PI) * 15;
      this.foot.y -= heightLift;
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    const base = this.getBase();
    const joint = solveIK(base, this.foot, this.length1, this.length2, this.flip);

    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.lineTo(joint.x, joint.y);
    ctx.lineTo(this.foot.x, this.foot.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.foot.x, this.foot.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3366';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(joint.x, joint.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}

export type DrawBodyFn = (ctx: CanvasRenderingContext2D, color: string) => void;

export class Creature {
  pos: {x: number, y: number};
  angle: number;
  legs: Leg[];
  speed: number;
  drawBody: DrawBodyFn;

  constructor(x: number, y: number, drawBody: DrawBodyFn) {
    this.pos = { x, y };
    this.angle = 0;
    this.legs = [];
    this.speed = 0.08;
    this.drawBody = drawBody;
  }

  addLeg(offsetX: number, offsetY: number, l1: number, l2: number, flip: boolean) {
    const leg = new Leg(this, offsetX, offsetY, l1, l2, flip);
    leg.foot = leg.getIdealFoot();
    this.legs.push(leg);
  }

  update(targetX: number, targetY: number) {
    this.pos.x = lerp(this.pos.x, targetX, this.speed);
    this.pos.y = lerp(this.pos.y, targetY, this.speed);

    const dx = targetX - this.pos.x;
    const dy = targetY - this.pos.y;
    if (Math.hypot(dx, dy) > 3) {
      const targetAngle = Math.atan2(dy, dx);
      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * 0.15;
    }

    // Alternating gait
    let group1Stepping = false;
    let group2Stepping = false;
    
    for (let i = 0; i < this.legs.length; i++) {
      if (i % 2 === 0 && this.legs[i].isStepping) group1Stepping = true;
      if (i % 2 !== 0 && this.legs[i].isStepping) group2Stepping = true;
    }

    for (let i = 0; i < this.legs.length; i++) {
      const leg = this.legs[i];
      const wantsToStep = leg.update(0.15);

      if (wantsToStep) {
        const isGroup1 = i % 2 === 0;
        if (isGroup1 && !group2Stepping) {
          this.initiateStep(leg, targetX, targetY);
          group1Stepping = true;
        } else if (!isGroup1 && !group1Stepping) {
          this.initiateStep(leg, targetX, targetY);
          group2Stepping = true;
        }
      }
    }
  }

  initiateStep(leg: Leg, targetX: number, targetY: number) {
    leg.isStepping = true;
    leg.stepProgress = 0;
    leg.stepOrigin = { x: leg.foot.x, y: leg.foot.y };
    
    const ideal = leg.getIdealFoot();
    const velocityX = (targetX - this.pos.x) * 0.5;
    const velocityY = (targetY - this.pos.y) * 0.5;
    
    leg.targetFoot = {
      x: ideal.x + velocityX,
      y: ideal.y + velocityY
    };
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    for (const leg of this.legs) {
      leg.draw(ctx, color);
    }
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);
    this.drawBody(ctx, color);
    ctx.restore();
  }
}

export const CreatureFactory = {
  createSpider: (x: number, y: number) => {
    const c = new Creature(x, y, (ctx, color) => {
      // Spider Abdomen
      ctx.beginPath(); ctx.ellipse(-8, 0, 18, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20, 20, 20, 0.8)'; ctx.fill();
      ctx.strokeStyle = color; ctx.stroke();
      
      // Black Widow Hourglass/Neon pattern
      ctx.beginPath();
      ctx.moveTo(-12, -4); ctx.lineTo(-4, 4); ctx.lineTo(-12, 4); ctx.lineTo(-4, -4);
      ctx.fillStyle = '#ff3366'; ctx.fill();
      
      // Cephalothorax
      ctx.beginPath(); ctx.ellipse(10, 0, 12, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 30, 30, 0.9)'; ctx.fill();
      ctx.stroke();
      
      // Mandibles
      ctx.beginPath(); ctx.moveTo(20, -4); ctx.lineTo(26, -2); ctx.lineTo(22, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, 4); ctx.lineTo(26, 2); ctx.lineTo(22, 0); ctx.stroke();

      // 8 Eyes
      ctx.fillStyle = '#ff3366';
      ctx.beginPath(); ctx.arc(14, -5, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(14, 5, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(17, -2, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(17, 2, 1.5, 0, Math.PI * 2); ctx.fill();
    });
    c.addLeg(0, -8, 25, 35, false); c.addLeg(0, 8, 25, 35, true);
    c.addLeg(-5, -10, 30, 40, false); c.addLeg(-5, 10, 30, 40, true);
    c.addLeg(-10, -8, 30, 40, false); c.addLeg(-10, 8, 30, 40, true);
    c.addLeg(5, -6, 20, 30, false); c.addLeg(5, 6, 20, 30, true);
    return c;
  },
  
  createDog: (x: number, y: number) => {
    const c = new Creature(x, y, (ctx, color) => {
      // Fluffy Tail
      ctx.beginPath(); ctx.moveTo(-20, 0); ctx.quadraticCurveTo(-30, 15, -45, 5); 
      ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(200, 150, 50, 0.8)'; ctx.stroke(); ctx.lineWidth = 3;

      // Body
      ctx.beginPath(); ctx.roundRect(-25, -12, 45, 24, 12);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.8)'; ctx.fill();
      ctx.strokeStyle = color; ctx.stroke();
      
      // Collar
      ctx.beginPath(); ctx.moveTo(15, -12); ctx.lineTo(15, 12);
      ctx.lineWidth = 4; ctx.strokeStyle = '#ff3366'; ctx.stroke(); ctx.lineWidth = 3;

      // Head
      ctx.beginPath(); ctx.arc(22, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 220, 150, 0.9)'; ctx.fill(); ctx.stroke();
      
      // Snout & Nose
      ctx.beginPath(); ctx.ellipse(32, 0, 6, 8, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.fill();
      ctx.beginPath(); ctx.arc(35, 0, 3, 0, Math.PI*2); ctx.fillStyle = '#000'; ctx.fill();
      
      // Tongue
      ctx.beginPath(); ctx.ellipse(32, 5, 4, 2, Math.PI/4, 0, Math.PI*2);
      ctx.fillStyle = '#ff6699'; ctx.fill();

      // Ears (Floppy or Pointy)
      ctx.beginPath(); ctx.ellipse(18, -12, 8, 5, -Math.PI/4, 0, Math.PI*2); 
      ctx.fillStyle = 'rgba(200, 150, 50, 0.9)'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(18, 12, 8, 5, Math.PI/4, 0, Math.PI*2); 
      ctx.fill(); ctx.stroke();

      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(26, -5, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(26, 5, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    c.addLeg(10, -12, 20, 20, false); c.addLeg(-10, 12, 20, 20, true);
    c.addLeg(-10, -12, 20, 20, false); c.addLeg(10, 12, 20, 20, true);
    return c;
  },

  createCat: (x: number, y: number) => {
    const c = new Creature(x, y, (ctx, color) => {
      // Long Curvy Tail
      ctx.beginPath(); ctx.moveTo(-15, 0); ctx.bezierCurveTo(-25, 0, -35, -25, -20, -30); 
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(100, 100, 150, 0.9)'; ctx.stroke(); ctx.lineWidth = 3;

      // Body
      ctx.beginPath(); ctx.roundRect(-20, -10, 35, 20, 10);
      ctx.fillStyle = 'rgba(120, 120, 180, 0.8)'; ctx.fill(); ctx.strokeStyle = color; ctx.stroke();
      
      // Stripes on body
      ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(-5, 0); ctx.moveTo(-10, 10); ctx.lineTo(-5, 0);
      ctx.moveTo(0, -10); ctx.lineTo(5, 0); ctx.moveTo(0, 10); ctx.lineTo(5, 0);
      ctx.strokeStyle = 'rgba(50, 50, 100, 0.5)'; ctx.stroke();

      // Head
      ctx.beginPath(); ctx.arc(15, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 140, 200, 0.9)'; ctx.fill(); ctx.strokeStyle = color; ctx.stroke();
      
      // Pointy Ears
      ctx.beginPath(); ctx.moveTo(10, -10); ctx.lineTo(15, -22); ctx.lineTo(22, -8); 
      ctx.fillStyle = 'rgba(140, 140, 200, 0.9)'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(15, 22); ctx.lineTo(22, 8); 
      ctx.fill(); ctx.stroke();
      
      // Pink Inner Ears
      ctx.beginPath(); ctx.moveTo(12, -11); ctx.lineTo(15, -18); ctx.lineTo(19, -9); 
      ctx.fillStyle = '#ff99cc'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, 11); ctx.lineTo(15, 18); ctx.lineTo(19, 9); 
      ctx.fill();
      
      // Whiskers
      ctx.beginPath(); 
      ctx.moveTo(25, -5); ctx.lineTo(35, -10); ctx.moveTo(25, -3); ctx.lineTo(35, -3);
      ctx.moveTo(25, 5); ctx.lineTo(35, 10); ctx.moveTo(25, 3); ctx.lineTo(35, 3);
      ctx.lineWidth = 1; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.lineWidth = 3;

      // Eyes (Slit)
      ctx.fillStyle = '#ccff00'; // cat eyes
      ctx.beginPath(); ctx.ellipse(22, -4, 2, 4, Math.PI/8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(22, 4, 2, 4, -Math.PI/8, 0, Math.PI * 2); ctx.fill();
    });
    c.addLeg(8, -8, 15, 15, false); c.addLeg(-8, 8, 15, 15, true);
    c.addLeg(-8, -8, 15, 15, false); c.addLeg(8, 8, 15, 15, true);
    return c;
  },

  createDino: (x: number, y: number) => {
    const c = new Creature(x, y, (ctx, color) => {
      // Thick Tail
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-45, 0); 
      ctx.lineWidth = 12; ctx.lineCap='round'; ctx.strokeStyle = 'rgba(50, 180, 100, 0.9)'; ctx.stroke(); 
      
      // Dorsal Spikes on Tail
      ctx.beginPath(); ctx.moveTo(-20, -6); ctx.lineTo(-25, -14); ctx.lineTo(-30, -6);
      ctx.moveTo(-35, -6); ctx.lineTo(-40, -12); ctx.lineTo(-45, -6);
      ctx.fillStyle = '#ffcc00'; ctx.fill();

      // Body
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60, 200, 120, 0.9)'; ctx.fill(); ctx.strokeStyle = color; ctx.stroke();
      
      // Spikes on Body
      ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-5, -22); ctx.lineTo(-10, -14);
      ctx.moveTo(10, -12); ctx.lineTo(5, -20); ctx.lineTo(0, -14);
      ctx.fill();

      // Big Head
      ctx.beginPath(); ctx.ellipse(25, 0, 16, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(70, 220, 130, 0.9)'; ctx.fill(); ctx.stroke();
      
      // Sharp Teeth (Mouth)
      ctx.beginPath(); ctx.moveTo(35, 2); ctx.lineTo(38, 5); ctx.lineTo(32, 6); ctx.lineTo(35, 8); ctx.lineTo(28, 9);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();

      // Tiny arms
      ctx.beginPath(); ctx.moveTo(15, -12); ctx.lineTo(25, -18); ctx.lineTo(28, -15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(15, 12); ctx.lineTo(25, 18); ctx.lineTo(28, 15); ctx.stroke();

      // Angry Eyes
      ctx.fillStyle = '#ff3366';
      ctx.beginPath(); ctx.arc(30, -5, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(30, 5, 3, 0, Math.PI * 2); ctx.fill();
      // Eyebrows
      ctx.beginPath(); ctx.moveTo(25, -8); ctx.lineTo(32, -6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(25, 8); ctx.lineTo(32, 6); ctx.stroke();
    });
    c.addLeg(-5, -14, 25, 25, false); c.addLeg(-5, 14, 25, 25, true);
    return c;
  },

  createChicken: (x: number, y: number) => {
    const c = new Creature(x, y, (ctx, color) => {
      // Big Tail feathers
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.bezierCurveTo(-20, -20, -35, -15, -25, 0);
      ctx.bezierCurveTo(-35, 15, -20, 20, -10, 0);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.fill(); ctx.strokeStyle = color; ctx.stroke();

      // Plump Round Body
      ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 250, 250, 0.9)'; ctx.fill(); ctx.stroke();
      
      // Wings on the side
      ctx.beginPath(); ctx.ellipse(-2, -10, 10, 5, -Math.PI/6, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(230, 230, 230, 0.9)'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-2, 10, 10, 5, Math.PI/6, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();

      // Head
      ctx.beginPath(); ctx.arc(18, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.fill(); ctx.stroke();
      
      // Beak
      ctx.beginPath(); ctx.moveTo(28, -4); ctx.lineTo(38, 0); ctx.lineTo(28, 4); 
      ctx.fillStyle = '#ffaa00'; ctx.fill(); ctx.stroke();
      
      // Red Wattle (under beak)
      ctx.beginPath(); ctx.ellipse(26, 6, 3, 5, Math.PI/4, 0, Math.PI*2);
      ctx.fillStyle = '#ff3333'; ctx.fill();

      // Large Comb (on top of head)
      ctx.beginPath(); ctx.arc(15, -12, 4, 0, Math.PI*2);
      ctx.arc(10, -10, 3, 0, Math.PI*2); ctx.arc(20, -10, 3, 0, Math.PI*2);
      ctx.fillStyle = '#ff3333'; ctx.fill();

      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(20, -3, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(20, 3, 2, 0, Math.PI * 2); ctx.fill();
    });
    c.addLeg(0, -12, 15, 20, false); c.addLeg(0, 12, 15, 20, true);
    return c;
  }
};
