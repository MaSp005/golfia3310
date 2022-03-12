random = (n, x, r) => !r ? Math.floor(Math.random() * (x - n)) + n : Math.random() * (x - n) + n;
class ParticleSystem {
  constructor(w, h, canvas) {
    if (canvas) this.canvas = canvas
    else this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    this.w = w;
    this.h = h;
    this.time = 0;
    this.fps = 60;
    this.int = null;
    this.particles = [];
    this.properties = {};
    this.nextspawn = 0;
    this.playing = false;
    this.debug = false;
    this.triggered = false;
  }
  setParticles(obj) {
    this.properties = obj;
  }
  setPreset(pre) {
    let presets = {
      fire: {
        shape: ["circle", [3, 7], "#ff6600"],
        spawnInterval: [1, 2],
        spawnAmount: 30,
        spawnPosition: [0, this.w, this.h + 10, this.h + 10],
        movement: (s, p, t, c) => [
          s[0] + Math.sin((t / c.shakespeed * 2 * Math.PI)) * c.shakex,
          p[1] - c.speed
        ],
        life: [0, 500, 300],
        custom: {
          speed: [5, 10],
          shakex: [8, 12],
          shakespeed: [700, 900]
        }
      },
      snow: {
        shape: ["circle", [3, 7], "#ffffff"],
        spawnInterval: [30, 50],
        spawnAmount: 30,
        spawnPosition: [0, this.w, 0, 0],
        movement: (s, p, t, c) => [
          s[0] + Math.sin((t / c.shakespeed * 2 * Math.PI)) * c.shakex,
          p[1] + c.speed
        ],
        life: [0, 500, 300],
        custom: {
          speed: [5, 10],
          shakex: [8, 12],
          shakespeed: [700, 900]
        }
      },
      speed: {
        shape: ["circle", [2, 4], "#ffffff"],
        spawnInterval: [10, 20],
        spawnAmount: 30,
        spawnPosition: [this.w + 10, this.w, 0, this.h],
        movement: (s, p, t, c) => [
          p[0] - c.speed,
          s[1] + Math.sin((t / c.shakespeed * 2 * Math.PI)) * c.shakey
        ],
        life: [0, 100, 200],
        custom: {
          speed: [29, 31],
          shakey: [-50, 50],
          shakespeed: [700, 900]
        }
      },
      jump: {
        shape: ["circle", [5, 6], "#ffffff"],
        spawnInterval: [50, 100],
        spawnAmount: 30,
        spawnPosition: [0, this.w, this.h + 10, this.h + 10],
        movement: (s, p, t, c) => [
          s[0] + t / 250 * c.movex,
				/*s[1]-*/((t / 200 - 2) ** 2) * c.height + c.height
        ],
        life: [0, 600, 200],
        custom: {
          height: [70, 150],
          movex: [-60, 60]
        }
      }
    };
    if (pre in presets) this.properties = presets[pre]
    else console.warn('"' + pre + '" is not a valid particle preset');
  }
  makeTriggerSystem(prop) {
    this.triggered = true;
    this.properties = prop || this.properties;
  }
  getDomElement() { return this.canvas }
  render() {
    this.time += Math.round(1000 / 60);
    if (this.properties.background) {
      this.ctx.fillStyle = this.properties.background;
      this.ctx.fillRect(0, 0, this.w, this.h);
    } else this.ctx.clearRect(0, 0, this.w, this.h);
    //console.log("rendering system"/*,this*/,"at time",this.time);
    if (!this.triggered && this.time > this.nextspawn) {
      //for(let n=0;n<Math.floor((this.time-this.nextspawn)/this.properties.spawnInterval[1]);n++)
      this.spawnparticle();
      this.nextspawn = this.time + random(this.properties.spawnInterval[0], this.properties.spawnInterval[1]);
    };
    let ctx = this.ctx;
    this.particles.forEach((x, i) => {
      x.lifetime = this.time - x.spawntime;
      if (typeof this.properties.movement == "object") {
        x.pos[0] += this.properties.movement[0];
        x.pos[1] += this.properties.movement[1];
      } else x.pos = this.properties.movement(x.startpos, x.pos, x.lifetime, x.custom);

      if (x.lifetime < this.properties.life[0]) {
        x.stage = 1;
        x.opacity = x.lifetime / this.properties.life[0];
      } else x.stage = 2;
      if (x.lifetime > this.properties.life[0] + this.properties.life[1]) {
        x.stage = 3;
        x.opacity = Math.min(1 - (x.lifetime - this.properties.life[0] - this.properties.life[1]) /
          this.properties.life[2], 1);
      }
      if (x.lifetime > this.properties.life[0] + this.properties.life[1] + this.properties.life[2] || x.opacity <= 0)
        return this.particles.splice(i, 1);
      /*
      ctx.fillStyle="black";
      this.ctx.fillText(x.lifetime,x.pos[0]+10,x.pos[1]+10,this.w);
      this.ctx.fillText(x.stage,x.pos[0]+10,x.pos[1]+20,this.w);
      this.ctx.fillText(x.opacity,x.pos[0]+10,x.pos[1]+30,this.w);*/
      ctx.fillStyle = this.properties.shape[2] +
        (Math.round(x.opacity * 255).toString(16).length == 1 ?
          "0" + Math.round(x.opacity * 255).toString(16) :
          Math.round(x.opacity * 255).toString(16));
      switch (this.properties.shape[0]) {
        case "circle":
          ctx.beginPath();
          ctx.arc(
            x.pos[0], x.pos[1],
            typeof this.properties.shape[1] == "object" ? x.radius : this.properties.shape[1],
            0, 2 * Math.PI, false);
          ctx.fill();
      }
    })
  }
  spawnparticle(x, y) {
    let o = {
      pos: [
        x || random(this.properties.spawnPosition[0], this.properties.spawnPosition[1]),
        y || random(this.properties.spawnPosition[2], this.properties.spawnPosition[3])
      ],
      spawntime: this.time,
      opacity: 1,
      stage: 0,
      custom: {}
    };
    o.startpos = o.pos;
    if (typeof this.properties.shape[1] == "object") o.radius =
      random(this.properties.shape[1][0], this.properties.shape[1][1]);
    if (this.properties.custom) Object.keys(this.properties.custom).forEach(y =>
      o.custom[y] = random(...this.properties.custom[y]));
    this.particles.push(o);
  }
  init(fps) {
    if (this.playing) return;
    this.fps = fps || 60;
    this.int = setInterval(() => this.render(), Math.round(1000 / this.fps));
    this.playing = true;
    if (this.debug !== true) return;
    this.canvas.addEventListener("click", e => {
      if (!this.playing) return this.init(60);
      this.pause();
      this.ctx.fillStyle = "black";
      this.ctx.fillText(`(${e.clientX}|${e.clientY})`, e.clientX, e.clientY);
      this.particles.forEach((x, i) => {
        this.ctx.fillText(JSON.stringify(x).replace(/\"/g, ""), 0, x.pos[1], this.w);
        this.ctx.fillText(i, 0, x.pos[1] - 10, this.w);
      })
    });
    this.debug = 2;
  }
  trigger(x, y) {
    if (!this.triggered) return console.warn("This System is not a triggered System.")
    for (let i = 0; i < this.properties.spawnAmount; i++) {
      this.spawnparticle(x, y)
    };
    //this.pause();
    this.init(this.fps || 60);
  }
  pause() { clearInterval(this.int); this.playing = false }
  clear() { this.ctx.clearRect(0, 0, this.w, this.h) }
  resize(w, h) {
    this.w = w;
    this.h = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }
  toJSON() {
    return {
      w: this.w,
      h: this.h,
      fps: this.fps,
      properties: this.properties,
      triggered: this.triggered
    }
  }
  loadfromJSON(j) {
    this.w = j.w,
    this.h = j.h,
    this.fps = j.fps,
    this.properties = j.properties,
    this.triggered = j.triggered,
    this.canvas = document.createElement("canvas");
    this.canvas.width = j.w;
    this.canvas.height = j.h;
  }
}