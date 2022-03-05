// if you ever feel like getting a headache, read this code

const canv = document.getElementsByTagName("canvas")[0],
  ctx = canv.getContext("2d"),
  w = 84,
  h = 48,
  pix = 10,
  col = ["#c7f0d8", "#43523d", "#f00", "#0f0", "#00f"],
  int = 1000 / 10,
  fric = 0.9,
  force = 5,
  bounce = 0.8,
  prec = 2 ** 8,
  maxdis = 5,
  goalvel = 2,
  // walls.map(x=>JSON.stringify(x).replace(/\"/g,"")).join(",\n") <- code for making the walls from the wallbuilder into normal json code
  levels = [
    {
      walls: [
        { x: 1, y: 18, l: 82, a: "x" },
        { x: 1, y: h - 18, l: 82, a: "x" }
      ],
      goal: { x: w - 8, y: h / 2 },
      startpos: [8, h / 2]
    }, {
      walls: [
        { x: 1, y: 32, l: 34, a: "x" },
        { x: 49, y: 14, l: 34, a: "x" },
        { x: 49, y: 14, l: 33, a: "y" },
        { x: 34, y: 1, l: 31, a: "y" }
      ],
      goal: { x: w - 8, y: 8 },
      startpos: [8, h - 8]
    }, {
      walls: [
        { x: 1, y: 16, l: 82, a: "x" },
        { x: 1, y: 31, l: 82, a: "x" },
        { x: 21, y: 17, l: 8, a: "y" },
        { x: 42, y: 23, l: 8, a: "y" },
        { x: 63, y: 17, l: 8, a: "y" }
      ],
      goal: { x: w - 8, y: h / 2 },
      startpos: [8, h / 2]
    }, {
      walls: [
        { x: 1, y: 16, l: 28, a: "x" },
        { x: 1, y: 31, l: 41, a: "x" },
        { x: 28, y: 1, l: 15, a: "y" },
        { x: 42, y: 16, l: 31, a: "y" },
        { x: 56, y: 1, l: 31, a: "y" },
        { x: 57, y: 31, l: 14, a: "x" },
        { x: 71, y: 16, l: 16, a: "y" }
      ],
      startpos: [5, h / 2],
      goal: { x: 64, y: h / 2 }
    },
    {
      walls: [
        { x: 1, y: 25, l: 72, a: "x" },
        { x: 1, y: 35, l: 82, a: "x" },
        { x: 1, y: 15, l: 82, a: "x" }
      ],
      startpos: [5, h / 2 + 6],
      goal: { x: 5, y: h / 2 - 4 }
    }, {
      walls: [
        { x: 1, y: 16, l: 21, a: "x" },
        { x: 1, y: 31, l: 32, a: "x" },
        { x: 21, y: 1, l: 15, a: "y" },
        { x: 32, y: 12, l: 19, a: "y" },
        { x: 33, y: 12, l: 9, a: "x" },
        { x: 41, y: 13, l: 34, a: "y" },
        { x: 52, y: 35, l: 10, a: "x" },
        { x: 52, y: 1, l: 34, a: "y" },
        { x: 61, y: 16, l: 19, a: "y" },
        { x: 62, y: 16, l: 21, a: "x" },
        { x: 72, y: 31, l: 11, a: "x" },
        { x: 72, y: 32, l: 15, a: "y" }
      ],
      goal: { x: w - 8, y: h / 2 },
      startpos: [8, h / 2]
    }, {
      walls: [
        { x: 1, y: 16, l: 30, a: "x" },
        { x: 1, y: 31, l: 30, a: "x" },
        { x: 30, y: 1, l: 16, a: "y" },
        { x: 30, y: 32, l: 15, a: "y" },
        { x: 42, y: 16, l: 16, a: "y" },
        { x: 43, y: 16, l: 12, a: "x" },
        { x: 43, y: 31, l: 12, a: "x" },
        { x: 55, y: 11, l: 6, a: "y" },
        { x: 55, y: 10, l: 19, a: "x" },
        { x: 55, y: 31, l: 6, a: "y" },
        { x: 55, y: 37, l: 19, a: "x" },
        { x: 64, y: 20, l: 8, a: "y" }
      ],
      startpos: [5, h / 2],
      goal: { x: 50, y: h / 2 }
    }, {
      walls: [
        { x: 1, y: 16, l: 28, a: "x" },
        { x: 1, y: 31, l: 28, a: "x" },
        { x: 28, y: 32, l: 7, a: "y" },
        { x: 28, y: 9, l: 7, a: "y" },
        { x: 28, y: 8, l: 49, a: "x" },
        { x: 28, y: 39, l: 49, a: "x" },
        { x: 57, y: 8, l: 9, a: "y" },
        { x: 57, y: 31, l: 9, a: "y" },
        { x: 65, y: 16, l: 16, a: "y" },
        { x: 76, y: 9, l: 8, a: "y" },
        { x: 76, y: 31, l: 8, a: "y" },
        { x: 72, y: 31, l: 11, a: "x" },
        { x: 72, y: 16, l: 11, a: "x" },
        { x: 49, y: 16, l: 16, a: "y" }
      ],
      startpos: [5, h / 2],
      goal: { x: w - 5, y: h / 2 }
    }, {
      walls: [
        { x: 1, y: 10, l: 73, a: "x" },
        { x: 63, y: 11, l: 27, a: "y" },
        { x: 73, y: 20, l: 27, a: "y" },
        { x: 54, y: 28, l: 9, a: "x" },
        { x: 54, y: 37, l: 10, a: "y" },
        { x: 54, y: 11, l: 9, a: "y" },
        { x: 44, y: 19, l: 19, a: "y" },
        { x: 35, y: 11, l: 18, a: "y" },
        { x: 35, y: 37, l: 10, a: "y" },
        { x: 26, y: 28, l: 9, a: "x" },
        { x: 26, y: 18, l: 10, a: "y" },
        { x: 16, y: 28, l: 10, a: "x" },
        { x: 10, y: 11, l: 18, a: "y" },
        { x: 16, y: 37, l: 11, a: "x" },
        { x: 10, y: 37, l: 10, a: "y" },
        { x: 16, y: 29, l: 8, a: "y" }
      ],
      goal: { x: 5, y: 15 },
      startpos: [5, 5],
    }//, {}, {}, {}, {}, {}, {}, {}, {}
  ],
  stroke = false,
  { PI, sqrt, min, max, ceil, floor, round, abs, sin, cos } = Math,
  mobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

const wait = t => new Promise(s => setTimeout(s, floor(t)));
canv.width = w * pix;
canv.height = h * pix;

var mat = [],
  view = "menu",
  sel = 0,
  to = null,
  held = {},
  playing = null,
  rot = 0,
  pos = [w / 2, h / 2],
  vel = [0, 0],
  cur = [w / 2, h / 2],
  tick = 0,
  clevel = 0,
  hits = levels.map(() => 0),
  hitf = 0,
  unlocked = 0,
  // cam = [0, 0]; <- remnants of a camera function i tested for making the playing field bigger but it failed :(
  globwalls = [
    { x: 0, y: 0, a: "x", l: w },
    { x: 0, y: h - 1, a: "x", l: w },
    { x: 0, y: 0, a: "y", l: h },
    { x: w - 1, y: 0, a: "y", l: h }
  ],
  loaddir = 1
;

load();

ctx.strokeStyle = "black";

function play(s, n) {
  if (playing) playing.pause();
  playing = new Audio(`./src/${n ? "notes" : "sound"}/${s}.wav`);
  playing.play();
}

function clearmat() {
  mat = [];
  for (x = 0; x < w; x++) {
    let s = [];
    for (y = 0; y < h; y++) {
      s.push(0);
    }
    mat.push(s);
  }
}

function fill(x1, y1, x2, y2, c) {
  for (let x = parseInt(x1); x <= x2; x++)
    for (let y = parseInt(y1); y <= y2; y++)
      mat[x][y] = c;
  return mat;
}

function drawchar(c, x, y, l) {
  if (c.length == 2) {
    drawchar(c.charAt(0), x - 2, y, l)
    drawchar(c.charAt(1), x + 2, y, l)
  }
  else switch (c.toString()) {
    case "1":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 3][y + 2] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 3][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "2":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 2][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "3":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "4":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 2][y + 2] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "5":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 2][y + 2] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "6":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 2][y + 2] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 2][y + 4] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "7":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "8":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 2][y + 2] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 2][y + 4] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "9":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 2][y + 2] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 3][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    case "0":
      mat[x + 2][y + 1] = Number(l);
      mat[x + 3][y + 1] = Number(l);
      mat[x + 4][y + 1] = Number(l);
      mat[x + 2][y + 2] = Number(l);
      mat[x + 4][y + 2] = Number(l);
      mat[x + 2][y + 3] = Number(l);
      mat[x + 4][y + 3] = Number(l);
      mat[x + 2][y + 4] = Number(l);
      mat[x + 4][y + 4] = Number(l);
      mat[x + 2][y + 5] = Number(l);
      mat[x + 3][y + 5] = Number(l);
      mat[x + 4][y + 5] = Number(l);
      break;
    default:
      mat[x + 2][y + 1] = Number(l);
  }
}

function draw() {
  for (x = 0; x < w; x++)
    for (y = 0; y < h; y++) {
      ctx.fillStyle = col[mat[x][y]] || col[0];
      ctx.fillRect(x * pix, y * pix, pix, pix);
      if (stroke) ctx.strokeRect(x * pix, y * pix, pix, pix);
    };
}

function goal() {
  console.log(clevel, unlocked, levels.length);
  unlocked = (unlocked == clevel) ? clevel + 1 : unlocked;
  play("jingle1");
  console.log(clevel, unlocked, levels.length);
  if (clevel + 1 >= levels.length) {
    setTimeout(render, 3000);
    return view = "menu";
  };
  vel = [0, 0];
  save();
  to = setTimeout(() => {
    clevel++;
    loadlevel();
    render();
  }, 3000);
}

function loadlevel(l) {
  if (l) clevel = l;
  hits[clevel] = 0;
  view = "ingame";
  globwalls = [
    { x: 0, y: 0, a: "x", l: (levels[clevel].w || w) },
    { x: 0, y: (levels[clevel].h || h) - 1, a: "x", l: (levels[clevel].w || w) },
    { x: 0, y: 0, a: "y", l: (levels[clevel].h || h) },
    { x: (levels[clevel].w || w) - 1, y: 0, a: "y", l: (levels[clevel].h || h) }
  ];
  pos = Array.from(levels[clevel].startpos);
  cur = Array.from(levels[clevel].startpos);
}

function save() {
  localStorage.setItem("golfia3310_prog", btoa(hits.join(",") + ";" + unlocked))
}

function load() {
  let data = localStorage.getItem("golfia3310_prog");
  if (!data) return;
  data = atob(data).split(";");
  hits = data[0].split(",").map(x => parseInt(x));
  unlocked = parseInt(data[1]);
  return data;
}

function render() {
  tick++;
  clearmat();
  if (held.backspace) return;
  switch (view) {
    case "ingame":
      let cdis = sqrt((pos[0] - cur[0]) ** 2 + (pos[1] - cur[1]) ** 2);
      // CONTROLS
      if ((held.r || held[7]) && !vel[0] && !vel[1]) {
        play("blip3");
        console.log("reset")
        loadlevel(clevel);
      };
      if (held.q || held[9]) {
        play("blip3");
        hits[clevel] = 0;
        sel = clevel;
        view = "menu";
      };
      if ((held.a || held[4]) && cur[0] > 0) cur[0]--;
      if ((held.d || held[6]) && cur[0] < w - 1) cur[0]++;
      if ((held.w || held[8]) && cur[1] > 0) cur[1]--;
      if ((held.s || held[2]) && cur[1] < h - 1) cur[1]++;
      let dis = [cur[0] - pos[0], cur[1] - pos[1]];
      let loading = false;
      if (
        (held[" "] || held[5]) &&
        !vel[0] && !vel[1] &&
        cdis < maxdis
      ) {
        console.log(hitf, force, loaddir);
        if (hitf < force && loaddir > 0 || hitf > 0 && loaddir < 0) hitf += loaddir * 0.125
        else loaddir = -loaddir;
        // console.log(hitf, force, loaddir);
        loading = true;
      };
      if (hitf && !(held[" "] || held[5])) {
        console.log(hitf, dis, force);
        hits[clevel]++;
        vel = dis.map(n => -n * hitf);
        hitf = 0;
        play("blip8");
        console.log(vel);
      }

      if (mobile) held.r = false;
      if (mobile) held.q = false;

      // MOVEMENT
      vel = vel.map(n => abs(n) < .3 ? 0 : n * fric);
      let tpos = pos;

      // WALLS
      for (r = 0; r < prec; r++) {
        tpos[0] += vel[0] / prec;
        tpos[1] += vel[1] / prec;
        [...globwalls, ...levels[clevel].walls].forEach(w => {
          try {
            if (w.a == "x") {
              for (x = w.x; x < w.x + w.l; x++) {
                mat[x][w.y] = 1;
              }
              if (
                (vel[0] || vel[1]) &&
                abs(pos[1] - w.y) < 2 &&
                pos[0] > w.x - 1 &&
                pos[0] < w.x + w.l + 1 &&
                (vel[1] < 0) !== (pos[1] - w.y < 0)
              ) {
                vel[1] *= -bounce;
                play("blip4");
              }
            } else {
              for (y = w.y; y < w.y + w.l; y++) {
                mat[w.x][y] = 1;
              }
              if (
                (vel[0] || vel[1]) &&
                abs(pos[0] - w.x) < 2 &&
                pos[1] > w.y - 1 &&
                pos[1] < w.y + w.l + 1 &&
                (vel[0] < 0) !== (pos[0] - w.x < 0)
              ) {
                vel[0] *= -bounce;
                play("blip4");
              }
            }
          } catch { }
        })
      }

      pos = tpos;
      // if (pos[0] - cam[0] < 5 && !!cam[0]) cam[0]--;
      // if (pos[0] - cam[0] > w - 5 && !!cam[0]) cam[0]++;
      // if (pos[1] - cam[1] < 5 && !!cam[1]) cam[1]--;
      // if (pos[1] - cam[1] > h - 5 && !!cam[1]) cam[1]++;
      // more remnants

      if (tick % 2 && loading) fill(0, h - 1, hitf * 8, h - 1, 0);
      if (loading) mat[41][h - 1] = 0;

      if ((tick % 6) && !vel[0] && !vel[1]) {
        let t = tick % 20 / 20 * PI;
        try {
          mat[min(w - 1, max(0, round(sin(t) * maxdis + pos[0])))]
          [min(h - 1, max(0, round(cos(t) * maxdis + pos[1])))] = 1
          mat[min(w - 1, max(0, round(sin(t) * maxdis + pos[0])))]
          [min(h - 1, max(0, round(cos(t) * maxdis + pos[1])))];

          mat[min(w - 1, max(0, round(-sin(t) * maxdis + pos[0])))]
          [min(h - 1, max(0, round(-cos(t) * maxdis + pos[1])))] = 1 -
            mat[min(w - 1, max(0, round(-sin(t) * maxdis + pos[0])))]
            [min(h - 1, max(0, round(-cos(t) * maxdis + pos[1])))];
        } catch { };
      }
      if (
        abs(levels[clevel].goal.x - pos[0]) < 1.5 &&
        abs(levels[clevel].goal.y - pos[1]) < 1.5 &&
        abs(vel[0]) + abs(vel[1]) < goalvel
      ) return goal();

      // DRAW BALL, CURSOR AND GOAL
      mat[round(pos[0])][round(pos[1])] = 1;
      mat[round(pos[0]) - 1][round(pos[1])] = 1;
      mat[round(pos[0]) + 1][round(pos[1])] = 1;
      mat[round(pos[0])][round(pos[1]) + 1] = 1;
      mat[round(pos[0])][round(pos[1]) - 1] = 1;

      mat[levels[clevel].goal.x - 1][levels[clevel].goal.y] = 1;
      mat[levels[clevel].goal.x + 1][levels[clevel].goal.y] = 1;
      mat[levels[clevel].goal.x][levels[clevel].goal.y + 1] = 1;
      mat[levels[clevel].goal.x][levels[clevel].goal.y - 1] = 1;

      if (mobile) fill(w - 5, h - 5, w - 1, h - 1, 1)
      if (mobile) fill(w - 5, 0, w - 1, 4, 1)
      if (mobile) fill(0, 0, 4, 4, 1)

      if (!vel[0] && !vel[1])
        mat[round(cur[0])][round(cur[1])] =
          (tick % ((cdis < maxdis) ? 4 : 2)) ? 1 : 0;

      break;
    case "menu":
      if ((held.d || held[6]) && levels[sel + 1]) { sel++; play("blip1") };
      if ((held.a || held[4]) && !!sel) { sel--; play("blip1") };
      if ((held.s || held[2]) && levels[sel + 5]) { sel += 5; play("blip1") };
      if ((held.w || held[8]) && levels[sel - 5]) { sel -= 5; play("blip1") };
      if ((held[" "] || held[5]) && unlocked >= sel) {
        play("negative2");
        clevel = sel;
        loadlevel();
      }
      levels.forEach((_l, i) => {
        fill(
          ((i % 5) * 15) + 5,
          (floor(i / 5) * 15) + 3,
          ((i % 5) * 15) + 17,
          (floor(i / 5) * 15) + 15,
          1
        )
        if (sel !== i) {
          fill(
            (i % 5) * 15 + 6,
            floor(i / 5) * 15 + 4,
            (i % 5) * 15 + 16,
            floor(i / 5) * 15 + 14,
            0
          )
        }

        if (unlocked >= i) {
          drawchar(
            (i + 1).toString(),
            (i % 5) * 15 + 8,
            (floor(i / 5) * 15) + (sel == i ? 3 : 6),
            sel !== i
          )
          if (sel == i)
            drawchar(
              hits[i].toString(),
              (i % 5) * 15 + 8,
              (floor(i / 5) * 15) + (sel == i ? 9 : 6),
              sel !== i
            )
        }
        draw();
      })
      break;
    default: view = "menu"
  }

  // DRAW MATRIX
  draw();
  to = setTimeout(render, int);
};
render();

if (mobile) document.addEventListener("click", e => { // mobile controls
  let x = floor(e.clientX / pix);
  let y = floor(e.clientY / pix);
  console.log(x, y);
  switch(view){
    case "ingame":
      if (held[" "]) return held[" "] = false;
      if (x > w - 5 && y > h - 5) {
        held[" "] = true;
      } else if (x > w - 5 && y < 5) {
        held.r = true;
      } else if (x < 5 && y < 5) {
        held.q = true;
      } else {
        cur = [x, y]
      }
      break;
    case "menu":
      // ((i % 5) * 15) + 5,
      //   (floor(i / 5) * 15) + 3,
      //   ((i % 5) * 15) + 17,
      //   (floor(i / 5) * 15) + 15,
      let sx = floor((x - 5) / 15);
      let sy = floor((y - 3) / 15);
      let s = sx + sy * 5;
      console.log(sx, sy, s);
      if (sel == s) {
        play("negative2");
        clevel = sel;
        loadlevel();
      } else sel = s;
      break;
  }
});

if (!mobile) document.addEventListener("keydown", e => held[e.key.toLowerCase()] = true);
if (!mobile) document.addEventListener("keyup", e => held[e.key.toLowerCase()] = false);