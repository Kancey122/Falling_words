// ========================================================
//  FALLING WORDS + 8-BIT NEON JUMPING CHARACTER
// ========================================================

const WORDS = {
  en: ['dream','pixel','light','star','moon','fire','code','wave','soul','echo',
       'void','flux','glow','byte','love','hope','wind','rain','time','fate',
       'dark','neon','rush','zen','vibe','bloom','crash','drift','spark','ghost'],
  ru: ['мечта','пиксель','свет','звезда','луна','огонь','код','волна','душа','эхо',
       'пустота','поток','сияние','байт','любовь','надежда','ветер','дождь','время','судьба',
       'тьма','неон','вихрь','дзен','ритм','цветок','удар','дрейф','искра','призрак'],
  ja: ['夢','光','星','月','炎','波','魂','虚空','流れ','輝き',
       '愛','希望','風','雨','時間','運命','闇','疾風','禅','響き',
       '花','衝撃','漂流','火花','幽霊','空','海','力','影','道'],
  es: ['sueño','píxel','luz','estrella','luna','fuego','código','ola','alma','eco',
       'vacío','flujo','brillo','amor','esperanza','viento','lluvia','tiempo','destino','sombra',
       'neón','impulso','ritmo','flor','choque','deriva','chispa','fantasma','cielo','fuerza'],
  de: ['traum','pixel','licht','stern','mond','feuer','code','welle','seele','echo',
       'leere','fluss','glanz','liebe','hoffnung','wind','regen','zeit','schicksal','dunkel',
       'neon','rausch','rhythmus','blume','crash','drift','funke','geist','himmel','kraft']
};

const LANG_KEYS = ['en','ru','ja','es','de'];
const LANG_LABELS = ['EN','RU','JA','ES','DE'];
const NUM_COLORS = 8;
const NUM_WORDS = 120;
const GLITCH_CHARS = '!@#$%^&*█▓▒░╔╗╚╝╠╣╦╩╬│─┼▀▄■□◆◇○●※∴∞≈≠±×÷';

let currentLangIdx = 0;
let isTransitioning = false;
let wordEls = [];

function randWord(lang) {
  const a = WORDS[lang];
  return a[Math.floor(Math.random() * a.length)];
}

function randGlitch(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  return s;
}

// ========================================================
//  FALLING WORDS
// ========================================================
function spawnWord(container, lang) {
  const el = document.createElement('span');
  el.className = 'falling-word w' + Math.floor(Math.random() * NUM_COLORS);
  el.style.left = (Math.random() * 94 + 1) + '%';
  el.style.fontSize = (8 + Math.random() * 16) + 'px';
  el.style.opacity = 0.25 + Math.random() * 0.6;
  el.textContent = randWord(lang);
  el._lang = lang;
  el._speed = 20 + Math.random() * 65;
  el._y = -(10 + Math.random() * 60);
  el._paused = false;
  container.appendChild(el);
  fallLoop(el);
  return el;
}

function fallLoop(el) {
  let last = null;
  function tick(ts) {
    if (!el.isConnected) return;
    if (el._paused) { requestAnimationFrame(tick); return; }
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;
    el._y += el._speed * dt;
    el.style.top = el._y + 'px';
    if (el._y > window.innerHeight + 40) {
      el._y = -(10 + Math.random() * 60);
      el.style.left = (Math.random() * 94 + 1) + '%';
      el.style.fontSize = (8 + Math.random() * 16) + 'px';
      el.textContent = randWord(el._lang);
      last = null;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ========================================================
//  LANGUAGE SWITCH
// ========================================================
function switchLanguage(newLang) {
  if (isTransitioning) return;
  isTransitioning = true;
  const STEPS = 8, MS = 60;

  wordEls.forEach(el => {
    el._paused = true;
    const len = el.textContent.length || 3;
    el.classList.remove('glitching'); void el.offsetWidth; el.classList.add('glitching');
    let s = 0;
    const iv = setInterval(() => {
      s++;
      if (s < STEPS/2) {
        el.textContent = randGlitch(len + Math.floor(Math.random()*3)-1);
      } else if (s === Math.floor(STEPS/2)) {
        el._lang = newLang; el.textContent = randGlitch(len);
      } else if (s < STEPS) {
        const w = randWord(newLang); let m = '';
        for (let i = 0; i < w.length; i++)
          m += Math.random() > s/STEPS ? GLITCH_CHARS[Math.floor(Math.random()*GLITCH_CHARS.length)] : w[i];
        el.textContent = m;
      } else {
        clearInterval(iv); el.textContent = randWord(newLang);
        el.classList.remove('glitching'); el._paused = false;
      }
    }, MS);
  });

  if (dude) dude.onLanguageSwitch();
  setTimeout(() => { isTransitioning = false; }, STEPS * MS + 100);
}

// ========================================================
//  8-BIT CHARACTER — NEON STYLE
// ========================================================
const SW = 9, SH = 12, PX = 3;

// Неоновая палитра чтобы вписаться в стиль сайта
// 0=прозрачный 1=циан(голова) 2=тёмный(глаза) 3=маджента(тело) 4=зелёный(ботинки) 5=циан(руки)
const PAL = { 0:null, 1:'#00ffff', 2:'#111133', 3:'#ff10f0', 4:'#39ff14', 5:'#00ffff' };

const FR_STAND = [
  [0,0,0,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,1,2,1,2,1,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,5,3,3,3,3,3,5,0],
  [0,5,3,3,3,3,3,5,0],
  [0,0,3,3,3,3,3,0,0],
  [0,0,0,3,3,3,0,0,0],
  [0,0,0,4,0,4,0,0,0],
  [0,0,4,4,0,4,4,0,0],
];

const FR_JUMP = [
  [0,5,0,1,1,1,0,5,0],
  [0,5,1,1,1,1,1,5,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,1,2,1,2,1,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,0,3,3,3,3,3,0,0],
  [0,0,3,3,3,3,3,0,0],
  [0,0,0,3,3,3,0,0,0],
  [0,0,4,0,0,0,4,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
];

const FR_FALL = [
  [0,0,0,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,1,2,1,2,1,0,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,0,0,0],
  [5,0,3,3,3,3,3,0,5],
  [5,0,3,3,3,3,3,0,5],
  [0,0,3,3,3,3,3,0,0],
  [0,0,0,3,3,3,0,0,0],
  [0,4,0,0,0,0,0,4,0],
  [4,4,0,0,0,0,0,4,4],
];

let dude = null;

class PixelDude {
  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'pixel-dude';
    this.cvs = document.createElement('canvas');
    this.cvs.width = SW * PX;
    this.cvs.height = SH * PX;
    this.el.style.width = (SW * PX) + 'px';
    this.el.style.height = (SH * PX) + 'px';
    this.el.appendChild(this.cvs);
    this.ctx = this.cvs.getContext('2d');
    document.body.appendChild(this.el);

    this.x = 0; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.gravity = 550;
    this.onGround = false;
    this.currentWord = null;
    this.dead = false;
    this.isFallingFromGlitch = false;
    this.jumpTimer = 0;
    this.jumpInterval = 1.0 + Math.random() * 0.8;
    this.facingRight = true;

    this.draw(FR_STAND);
    this.spawn();
  }

  draw(frame) {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    for (let r = 0; r < SH; r++)
      for (let c = 0; c < SW; c++) {
        const col = PAL[frame[r][c]];
        if (!col) continue;
        this.ctx.fillStyle = col;
        this.ctx.fillRect(c * PX, r * PX, PX, PX);
      }
  }

  findTarget() {
    const mx = this.x + (SW * PX) / 2;
    const my = this.y;
    const maxD = 400;
    let best = null, bestScore = Infinity;

    for (const el of wordEls) {
      if (el === this.currentWord) continue;
      const r = el.getBoundingClientRect();
      if (r.top < 10 || r.top > window.innerHeight - 30) continue;
      if (r.left < 0 || r.right > window.innerWidth) continue;
      const wx = r.left + r.width / 2, wy = r.top;
      const dx = wx - mx, dy = wy - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > maxD) continue;
      const score = dist + (dy > 80 ? dy * 1.5 : 0);
      if (score < bestScore) { bestScore = score; best = el; }
    }
    return best;
  }

  jumpTo(el) {
    const r = el.getBoundingClientRect();
    const tx = r.left + r.width/2 - (SW*PX)/2;
    const ty = r.top - SH*PX + 2;
    const dx = tx - this.x, dy = ty - this.y;
    const t = 0.5;
    this.vx = dx / t;
    this.vy = dy / t - 0.5 * (-this.gravity) * t;
    this.vy = Math.min(this.vy, -180);
    this.onGround = false;
    this.currentWord = el;
    this.facingRight = dx > 0;
    this.draw(FR_JUMP);
  }

  spawn() {
    this.dead = false;
    this.isFallingFromGlitch = false;
    this.el.classList.remove('falling-glitch');
    this.el.style.display = 'block';
    this.el.style.opacity = '1';

    const vis = wordEls.filter(el => {
      const r = el.getBoundingClientRect();
      return r.top > 80 && r.top < window.innerHeight - 120 && r.left > 10 && r.right < window.innerWidth - 10;
    });

    if (!vis.length) { setTimeout(() => this.spawn(), 400); return; }

    const w = vis[Math.floor(Math.random() * vis.length)];
    const r = w.getBoundingClientRect();
    this.x = r.left + r.width/2 - (SW*PX)/2;
    this.y = r.top - SH*PX + 2;
    this.vx = 0; this.vy = 0;
    this.onGround = true;
    this.currentWord = w;
    this.jumpTimer = 0;
    this.jumpInterval = 0.8 + Math.random() * 0.8;

    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';

    this.el.classList.remove('respawning'); void this.el.offsetWidth;
    this.el.classList.add('respawning');
    setTimeout(() => this.el.classList.remove('respawning'), 500);

    this.draw(FR_STAND);
  }

  onLanguageSwitch() {
    // Не прячем! Персонаж физически падает вниз с глитч-эффектом
    this.isFallingFromGlitch = true;
    this.onGround = false;
    this.currentWord = null;
    this.vx = (Math.random() - 0.5) * 150;
    this.vy = -100; // подброс вверх сначала

    this.el.classList.remove('falling-glitch'); void this.el.offsetWidth;
    this.el.classList.add('falling-glitch');
    this.draw(FR_FALL);

    // Респавн через 2.5 сек
    this._respawnTimer = setTimeout(() => {
      if (this.isFallingFromGlitch || this.dead) {
        this.el.classList.remove('falling-glitch');
        this.spawn();
      }
    }, 2500);
  }

  update(dt) {
    // Падение от глитча — физика работает, персонаж видим и падает вниз
    if (this.isFallingFromGlitch) {
      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.el.style.left = this.x + 'px';
      this.el.style.top = this.y + 'px';

      // Если упал за экран — скрыть, ждать респавн таймер
      if (this.y > window.innerHeight + 80) {
        this.dead = true;
        this.isFallingFromGlitch = false;
        this.el.style.display = 'none';
        this.el.classList.remove('falling-glitch');
      }
      return;
    }

    if (this.dead) return;

    if (this.onGround && this.currentWord) {
      const r = this.currentWord.getBoundingClientRect();
      if (r.top > window.innerHeight + 20 || r.top < -80) {
        const t = this.findTarget();
        if (t) { this.jumpTo(t); }
        else { this.onGround = false; this.currentWord = null; this.vy = 50; }
        return;
      }

      this.x = r.left + r.width/2 - (SW*PX)/2;
      this.y = r.top - SH*PX + 2;

      this.jumpTimer += dt;
      if (this.jumpTimer >= this.jumpInterval) {
        this.jumpTimer = 0;
        this.jumpInterval = 0.7 + Math.random() * 1.0;
        const t = this.findTarget();
        if (t) this.jumpTo(t);
      }
    } else {
      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      // Приземление на целевое слово
      if (this.currentWord && this.vy > 0) {
        const r = this.currentWord.getBoundingClientRect();
        const bot = this.y + SH*PX, cx = this.x + (SW*PX)/2;
        if (bot >= r.top && bot <= r.top + r.height + 12 && cx >= r.left - 15 && cx <= r.right + 15) {
          this.y = r.top - SH*PX + 2;
          this.vy = 0; this.vx = 0; this.onGround = true;
          this.draw(FR_STAND);
        }
      }

      // Приземление на любое слово
      if (!this.onGround && this.vy > 0) {
        const bot = this.y + SH*PX, cx = this.x + (SW*PX)/2;
        for (const el of wordEls) {
          const r = el.getBoundingClientRect();
          if (bot >= r.top && bot <= r.top + 10 && cx >= r.left - 8 && cx <= r.right + 8) {
            this.y = r.top - SH*PX + 2;
            this.vy = 0; this.vx = 0; this.onGround = true;
            this.currentWord = el; this.draw(FR_STAND);
            break;
          }
        }
      }

      if (this.y > window.innerHeight + 50) {
        this.dead = true; this.el.style.display = 'none';
        setTimeout(() => this.spawn(), 1200);
        return;
      }
    }

    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
    this.el.style.transform = this.facingRight ? '' : 'scaleX(-1)';
  }
}

// ========================================================
//  GAME LOOP
// ========================================================
let lastT = null;
function loop(ts) {
  if (!lastT) lastT = ts;
  const dt = Math.min((ts - lastT) / 1000, 0.05);
  lastT = ts;
  if (dude) dude.update(dt);
  requestAnimationFrame(loop);
}

// ========================================================
//  INIT
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('falling-words-container');
  const btn = document.getElementById('language-btn');
  const btnText = btn.querySelector('.button-text');

  for (let i = 0; i < NUM_WORDS; i++) {
    const el = spawnWord(container, LANG_KEYS[currentLangIdx]);
    el._y = Math.random() * window.innerHeight;
    wordEls.push(el);
  }

  setTimeout(() => {
    dude = new PixelDude();
    requestAnimationFrame(loop);
  }, 600);

  btn.addEventListener('click', () => {
    if (isTransitioning) return;
    btn.classList.remove('pressed'); void btn.offsetWidth;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 700);
    currentLangIdx = (currentLangIdx + 1) % LANG_KEYS.length;
    btnText.textContent = LANG_LABELS[currentLangIdx];
    switchLanguage(LANG_KEYS[currentLangIdx]);
  });
});
