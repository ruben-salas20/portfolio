/**
 * Escena de los márgenes: Rubén dirige y los Clawd arreglan los fallos que
 * aparecen de vez en cuando, repartidos en varias franjas junto a las
 * secciones. Entre arreglo y arreglo los Clawd pasean. A veces un fallo de su
 * franja lo arregla Rubén y un Clawd lo revisa: es la misma historia que
 * cuenta "Cómo trabajo".
 *
 * Cada franja tiene su línea de suelo, así que el movimiento es solo
 * horizontal. Cada personaje es una máquina de estados pequeña:
 * idle → going → working → returning, más wander (pasear) y watching (mirar).
 *
 * Con "reducir movimiento" se pinta una escena quieta y no hay bucle.
 */
import {
  bang,
  bug,
  check,
  clawd,
  ruben,
  RUBEN_PX,
  signs,
  spark,
  toSvg,
  wall,
  type Grid,
} from './sprites';

export interface SceneText {
  name: string;
  assign: { wall: string; sign: string; bug: string };
  going: string;
  done: string;
  self: string;
  selfDone: string;
  approve: string;
}

const PX = 3;
const SPEED = 40; // px por segundo al caminar
const FIX_MS = 2400; // lo que dura un arreglo
const STEP_MS = 160; // un paso de la animación de caminar
const SAY_MS = 1800; // lo que dura un bocadillo en pantalla
const SPAWN_MS: [number, number] = [7000, 12000]; // cada cuánto aparece un fallo
const WANDER_MS: [number, number] = [4000, 9000]; // cada cuánto pasea un Clawd

type State = 'idle' | 'wander' | 'going' | 'working' | 'returning' | 'watching';
type Kind = 'wall' | 'sign' | 'bug';

interface Zone {
  el: HTMLElement;
  width: number;
  // Dónde pueden aparecer fallos: en la franja de Rubén, lejos de él.
  range: [number, number];
}

class Sprite {
  readonly el = document.createElement('div');
  x = 0;
  lift = 0;
  mirror = false;
  frame: Grid;
  readonly px: number;
  private drawn: { frame: Grid; mirror: boolean } | null = null;

  constructor(parent: HTMLElement, frame: Grid, px = PX) {
    this.frame = frame;
    this.px = px;
    this.el.className = 'sprite';
    parent.append(this.el);
  }

  get width() {
    return this.frame[0].length * this.px;
  }

  get height() {
    return this.frame.length * this.px;
  }

  render() {
    // Rehacer el SVG solo cuando cambia el dibujo; moverlo es solo transform.
    if (this.drawn?.frame !== this.frame || this.drawn.mirror !== this.mirror) {
      this.el.innerHTML = toSvg(this.frame, this.px, this.mirror);
      this.drawn = { frame: this.frame, mirror: this.mirror };
    }
    this.el.style.transform = `translate(${Math.round(this.x)}px, ${-Math.round(this.lift)}px)`;
  }

  fadeOut() {
    this.el.style.opacity = '0';
    setTimeout(() => this.el.remove(), 300);
  }
}

interface Glitch {
  zone: Zone;
  kind: Kind;
  body: Sprite;
  mark: Sprite;
  spark: Sprite | null;
  byRuben: boolean;
  taken: boolean;
  fixed: boolean;
  dir: number;
}

interface Walker {
  sprite: Sprite;
  zone: Zone;
  home: number;
  roam: [number, number];
  frames: { stand: Grid; walkA: Grid; walkB: Grid };
  isRuben: boolean;
  state: State;
  target: Glitch | null;
  spot: number;
  until: number;
  nextWander: number;
  blinkOffset: number;
  bubble: HTMLElement;
  bubbleUntil: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

export function startScene(zoneEls: HTMLElement[], text: SceneText) {
  const zones: Zone[] = zoneEls.map((el, i) => {
    const width = el.clientWidth;
    return { el, width, range: i === 0 ? [120, width] : [0, width] };
  });
  const [home] = zones;
  const now0 = performance.now();

  const walker = (zone: Zone, x: number, isRuben: boolean): Walker => {
    const frames = isRuben ? ruben : clawd;
    const sprite = new Sprite(zone.el, frames.stand, isRuben ? RUBEN_PX : PX);
    sprite.x = x;
    if (isRuben) {
      // La etiqueta con el nombre sale al pasar el cursor (ver global.css).
      sprite.el.classList.add('sprite-ruben');
      sprite.el.dataset.name = text.name;
    }
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.hidden = true;
    zone.el.append(bubble);
    return {
      sprite,
      zone,
      home: x,
      // Rubén apenas se mueve de su sitio; los Clawd pasean por su franja.
      roam: isRuben ? [0, 30] : [zone === home ? 60 : 0, zone.width - sprite.width],
      frames,
      isRuben,
      state: 'idle',
      target: null,
      spot: x,
      until: 0,
      nextWander: now0 + rand(...WANDER_MS),
      blinkOffset: Math.random() * 3000,
      bubble,
      bubbleUntil: 0,
    };
  };

  const me = walker(home, 8, true);
  const claudes = zones.map((zone) => walker(zone, zone === home ? 64 : rand(20, zone.width - 60), false));
  const walkers = [me, ...claudes];
  let glitches: Glitch[] = [];
  let homeSpawned = 0;
  let pointUntil = 0;
  let pointRight = true;

  const available = (w: Walker) => w.state === 'idle' || w.state === 'wander';

  function say(w: Walker, line: string, ms = SAY_MS) {
    w.bubble.textContent = line;
    w.bubble.hidden = false;
    w.bubbleUntil = performance.now() + ms;
  }

  function spawn(forced?: { zone: Zone; kind: Kind; x: number }) {
    // Un fallo por franja como mucho: la escena se mira de reojo, no es un juego.
    const free = zones.filter((z) => !glitches.some((g) => g.zone === z));
    if (!forced && free.length === 0) return;
    const zone = forced?.zone ?? pick(free);
    const kind = forced?.kind ?? pick(['wall', 'sign', 'bug'] as const);
    const frame = kind === 'wall' ? wall.broken : kind === 'sign' ? signs.broken : bug.a;
    const body = new Sprite(zone.el, frame);
    const [min, max] = zone.range;
    body.x = forced?.x ?? rand(min, max - body.width);
    body.el.animate({ opacity: [0, 1] }, { duration: 300 });

    const mark = new Sprite(zone.el, bang);
    const byRuben = zone === home && ++homeSpawned % 2 === 0;
    glitches.push({ zone, kind, body, mark, spark: null, byRuben, taken: false, fixed: false, dir: 1 });
  }

  function assign(w: Walker, g: Glitch, watching = false) {
    w.target = g;
    w.state = 'going';
    // Colocarse al lado del fallo por el que llega. Quien mira se pone detrás
    // de Rubén, que ocupa el sitio de al lado: su ancho más un respiro.
    const fromLeft = w.sprite.x < g.body.x;
    const gap = watching ? me.sprite.width + 8 : 2;
    w.spot = fromLeft ? g.body.x - w.sprite.width - gap : g.body.x + g.body.width + gap;
  }

  function fix(g: Glitch) {
    g.fixed = true;
    g.spark?.fadeOut();
    g.spark = null;
    if (g.kind === 'wall') g.body.frame = wall.fixed;
    if (g.kind === 'sign') g.body.frame = signs.fixed;
    if (g.kind === 'bug') g.body.fadeOut();
    g.mark.frame = check;
    g.mark.el.style.visibility = 'visible';
    setTimeout(() => {
      g.mark.fadeOut();
      if (g.kind !== 'bug') g.body.fadeOut();
      glitches = glitches.filter((other) => other !== g);
    }, 1100);
  }

  // Devuelve true al llegar.
  function walkTo(w: Walker, x: number, dt: number, now: number) {
    const d = x - w.sprite.x;
    if (Math.abs(d) < 1) {
      w.sprite.x = x;
      w.sprite.frame = w.frames.stand;
      return true;
    }
    w.sprite.mirror = d < 0;
    w.sprite.x += Math.sign(d) * Math.min(Math.abs(d), SPEED * dt);
    w.sprite.frame = Math.floor(now / STEP_MS) % 2 ? w.frames.walkA : w.frames.walkB;
    return false;
  }

  function updateWalker(w: Walker, dt: number, now: number) {
    const g = w.target;
    w.sprite.lift = 0;
    switch (w.state) {
      case 'idle': {
        w.sprite.frame = w.frames.stand;
        if (w.isRuben && now < pointUntil) {
          w.sprite.frame = ruben.point;
          w.sprite.mirror = !pointRight;
        } else if (!w.isRuben && (now + w.blinkOffset) % 3200 < 140) {
          w.sprite.frame = clawd.blink;
        }
        if (now >= w.nextWander && now >= pointUntil) {
          w.spot = rand(...w.roam);
          w.state = 'wander';
        }
        break;
      }
      case 'wander': {
        if (walkTo(w, w.spot, dt, now)) {
          w.home = w.spot;
          w.state = 'idle';
          w.nextWander = now + rand(...WANDER_MS);
        }
        break;
      }
      case 'going': {
        if (!g || !walkTo(w, w.spot, dt, now)) break;
        w.sprite.mirror = w.sprite.x > g.body.x;
        if (g.byRuben && !w.isRuben) {
          w.state = 'watching';
        } else {
          w.state = 'working';
          w.until = now + FIX_MS;
          g.spark = new Sprite(g.zone.el, spark.a);
          g.spark.x = g.body.x + g.body.width / 2 - 4;
          g.spark.lift = g.body.height / 2;
        }
        break;
      }
      case 'working': {
        if (!g) break;
        const beat = Math.floor(now / 200) % 2 === 0;
        if (w.isRuben) w.sprite.frame = beat ? ruben.point : ruben.stand;
        else w.sprite.lift = beat ? 3 : 0;
        if (g.spark) g.spark.frame = beat ? spark.a : spark.b;
        if (now >= w.until) {
          fix(g);
          w.state = 'returning';
          if (w.isRuben) {
            // Rubén pregunta y el Clawd que miraba le da el visto bueno.
            say(w, text.selfDone);
            const watcher = claudes.find((c) => c.target === g);
            if (watcher) setTimeout(() => say(watcher, text.approve), 900);
          } else {
            say(w, text.done);
          }
        }
        break;
      }
      case 'watching': {
        // Asiente despacio mientras Rubén trabaja.
        w.sprite.lift = Math.floor(now / 400) % 2 ? 2 : 0;
        if (!g || g.fixed) w.state = 'returning';
        break;
      }
      case 'returning': {
        if (walkTo(w, w.home, dt, now)) {
          w.state = 'idle';
          w.target = null;
          w.sprite.mirror = false;
          w.nextWander = now + rand(...WANDER_MS);
        }
        break;
      }
    }
  }

  function dispatch(now: number) {
    for (const g of glitches) {
      if (g.taken || g.fixed) continue;
      // Un Clawd que pasea también puede atender: deja el paseo a medias.
      const helper = claudes.find((c) => c.zone === g.zone && available(c));
      if (!helper) continue;
      if (g.byRuben) {
        if (!available(me)) continue;
        assign(me, g);
        assign(helper, g, true);
        say(me, text.self);
      } else {
        assign(helper, g);
        say(helper, text.going);
        if (available(me)) {
          me.state = 'idle';
          pointUntil = now + 1400;
          pointRight = g.zone !== home || g.body.x > me.sprite.x;
          say(me, text.assign[g.kind]);
        }
      }
      g.taken = true;
    }
  }

  function updateGlitches(dt: number, now: number) {
    for (const g of glitches) {
      if (!g.fixed && g.kind === 'bug' && !g.taken) {
        const [min, max] = g.zone.range;
        g.body.x += g.dir * 10 * dt;
        if (g.body.x < min || g.body.x > max - g.body.width) g.dir *= -1;
        g.body.frame = Math.floor(now / 200) % 2 ? bug.a : bug.b;
      }
      if (!g.fixed) g.mark.el.style.visibility = Math.floor(now / 450) % 2 ? 'visible' : 'hidden';
      g.mark.x = g.body.x + g.body.width / 2 - g.mark.width / 2;
      g.mark.lift = g.body.height + 6;
    }
  }

  function render(now: number) {
    for (const w of walkers) {
      w.sprite.render();
      if (now > w.bubbleUntil) w.bubble.hidden = true;
      if (!w.bubble.hidden) {
        // Centrado sobre quien habla, pero sin salirse de su franja: en el
        // ancho mínimo, el de Rubén se saldría de la pantalla por la izquierda.
        const half = w.bubble.offsetWidth / 2;
        const center = w.sprite.x + w.sprite.width / 2;
        const x = Math.round(Math.min(Math.max(center, half), w.zone.width - half));
        const y = -Math.round(w.sprite.height + w.sprite.lift + 8);
        w.bubble.style.transform = `translate(${x}px, ${y}px) translateX(-50%)`;
      }
    }
    for (const g of glitches) {
      g.body.render();
      g.mark.render();
      g.spark?.render();
    }
  }

  // ---- Modo quieto: una escena fija, sin bucle -------------------------

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const target = zones[1] ?? home;
    spawn({ zone: target, kind: 'sign', x: 40 });
    const [sign] = glitches;
    const helper = claudes[zones.indexOf(target)];
    helper.sprite.x = sign.body.x + sign.body.width + 2;
    helper.sprite.mirror = true;
    me.sprite.frame = ruben.point;
    say(me, text.assign.sign, Infinity);
    say(helper, text.going, Infinity);
    updateGlitches(0, 0);
    render(0);
    return () => {};
  }

  // ---- Bucle ------------------------------------------------------------

  let raf = 0;
  let last = now0;
  let nextSpawn = last + 2500;

  function tick(now: number) {
    // Tope al paso: al volver de una pestaña en segundo plano no hay saltos.
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (now >= nextSpawn) {
      spawn();
      nextSpawn = now + rand(...SPAWN_MS);
    }
    dispatch(now);
    updateGlitches(dt, now);
    for (const w of walkers) updateWalker(w, dt, now);
    render(now);
    raf = requestAnimationFrame(tick);
  }

  render(now0);
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
